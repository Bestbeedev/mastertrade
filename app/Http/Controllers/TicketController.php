<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\License;
use App\Models\TicketMessage;
use App\Models\TicketAttachment;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');
        $search = trim((string) $request->query('search', ''));
        $sort = $request->query('sort', 'recent');

        $query = Ticket::query()->where('user_id', Auth::id());

        if (in_array($status, ['open', 'pending', 'closed'])) {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        if ($sort === 'old') {
            $query->orderBy('created_at', 'asc');
        } elseif ($sort === 'priority') {
            // high > medium > low
            $query->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END");
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $tickets = $query->paginate(10, ['id', 'subject', 'message', 'status', 'order_id', 'license_id', 'priority', 'category', 'created_at', 'updated_at'])->withQueryString();

        $base = Ticket::where('user_id', Auth::id());
        $counts = [
            'all' => (clone $base)->count(),
            'open' => (clone $base)->where('status', 'open')->count(),
            'pending' => (clone $base)->where('status', 'pending')->count(),
            'closed' => (clone $base)->where('status', 'closed')->count(),
        ];

        return Inertia::render('client/ticket', [
            'tickets' => $tickets,
            'ticketsCounts' => $counts,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $orders = Order::with(['product:id,name'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get(['id', 'product_id', 'created_at']);

        $licenses = License::with(['product:id,name'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get(['id', 'product_id', 'expiry_date', 'created_at']);

        return Inertia::render('client/ticket-create', [
            'orders' => $orders,
            'licenses' => $licenses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10'],
            'order_id' => ['nullable', 'string'],
            'license_id' => ['nullable', 'string'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $ticket = Ticket::create([
            'user_id' => Auth::id(),
            'subject' => $data['subject'],
            'message' => $data['message'],
            'order_id' => $data['order_id'] ?? null,
            'license_id' => $data['license_id'] ?? null,
            'status' => 'open',
            'priority' => $data['priority'] ?? 'medium',
            'category' => $data['category'] ?? null,
        ]);

        // Créer le premier message dans le fil
        $msg = TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $data['message'],
        ]);

        // Gérer les pièces jointes optionnelles
        if ($request->hasFile('attachments')) {
            foreach ((array) $request->file('attachments') as $file) {
                if (!$file) {
                    continue;
                }
                $path = $file->store('tickets', 'public');
                TicketAttachment::create([
                    'ticket_message_id' => $msg->id,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        return redirect()->route('supportsTickets.show', $ticket);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        abort_unless($ticket->user_id === Auth::id(), 403);
        $ticket->load([
            'order:id,product_id',
            'order.product:id,name',
            'license:id,product_id,expiry_date',
            'license.product:id,name',
            'messages:id,ticket_id,user_id,message,created_at',
            'messages.user:id,name',
            'messages.attachments:id,ticket_message_id,path,original_name,mime_type,size'
        ]);
        return Inertia::render('client/ticket-show', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->user_id === Auth::id(), 403);
        $data = $request->validate([
            'status' => ['required', 'in:open,pending,closed'],
        ]);
        $ticket->update($data);
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        abort_unless($ticket->user_id === Auth::id(), 403);
        $ticket->delete();
        return redirect()->route('supportsTickets');
    }

    /**
     * Post a reply (placeholder without thread storage)
     */
    public function reply(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->user_id === Auth::id(), 403);
        $data = $request->validate([
            'message' => ['required', 'string', 'min:2'],
        ]);
        // Créer une réponse dans le fil
        $msg = TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $data['message'],
        ]);
        // Gérer les pièces jointes optionnelles
        if ($request->hasFile('attachments')) {
            foreach ((array) $request->file('attachments') as $file) {
                if (!$file) {
                    continue;
                }
                $path = $file->store('tickets', 'public');
                TicketAttachment::create([
                    'ticket_message_id' => $msg->id,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }
        // Mettre à jour le statut avec des valeurs autorisées
        $ticket->status = $ticket->status === 'closed' ? 'open' : 'pending';
        $ticket->save();
        return back();
    }

    public function close(Ticket $ticket)
    {
        abort_unless($ticket->user_id === Auth::id(), 403);
        $ticket->update(['status' => 'closed']);
        return back();
    }

    public function reopen(Ticket $ticket)
    {
        abort_unless($ticket->user_id === Auth::id(), 403);
        $ticket->update(['status' => 'open']);
        return back();
    }
}
