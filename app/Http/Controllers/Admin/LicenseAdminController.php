<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\License;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;

class LicenseAdminController extends Controller
{
    public function index(Request $request)
    {
        $q = (string) $request->input('q', '');
        $status = (string) $request->input('status', '');

        $licensesQuery = License::with(['product:id,name,version', 'user:id,name,email'])
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($s) use ($q) {
                    $s->where('key', 'like', "%$q%")
                        ->orWhereHas('user', function ($u) use ($q) {
                            $u->where('email', 'like', "%$q%");
                        })
                        ->orWhereHas('product', function ($p) use ($q) {
                            $p->where('name', 'like', "%$q%");
                        });
                });
            })
            ->when($status !== '' && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('created_at')
            ->take(150);

        $columns = ['id', 'key', 'status', 'type', 'expiry_date', 'max_activations', 'activations_count', 'product_id', 'user_id', 'created_at'];
        foreach (['last_device_id', 'last_machine', 'last_mac_address', 'last_activated_at'] as $col) {
            if (Schema::hasColumn('licenses', $col)) {
                $columns[] = $col;
            }
        }

        $licenses = $licensesQuery->get($columns);

        $products = Product::select(['id', 'name'])->orderBy('name')->get();
        $users = User::select(['id', 'name', 'email'])->orderBy('name')->take(200)->get();

        return Inertia::render('admin/licenses', [
            'licenses' => $licenses,
            'products' => $products,
            'users' => $users,
            'filters' => [
                'q' => $q,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'string', 'exists:users,id'],
            'product_id' => ['required', 'string', 'exists:products,id'],
            'type' => ['required', 'in:subscription,perpetual'],
            'status' => ['required', 'in:active,expired,inactive'],
            'expiry_date' => ['nullable', 'date'],
            'max_activations' => ['nullable', 'integer', 'min:1'],
        ]);

        $license = new License();
        $license->user_id = $data['user_id'];
        $license->product_id = $data['product_id'];
        $license->type = $data['type'];
        $license->status = $data['status'];
        $license->expiry_date = $data['expiry_date'] ?? now()->addYear()->toDateString();
        $license->max_activations = $data['max_activations'] ?? 1;
        $license->activations_count = 0;
        $license->key = $this->generateLicenseKey();
        $license->save();

        return back()->with('success', 'Licence créée');
    }

    public function update(Request $request, License $license)
    {
        $data = $request->validate([
            'status' => ['sometimes', 'in:active,expired,inactive'],
            'type' => ['sometimes', 'in:subscription,perpetual'],
            'expiry_date' => ['sometimes', 'nullable', 'date'],
            'max_activations' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'user_id' => ['sometimes', 'string', 'exists:users,id'],
            'product_id' => ['sometimes', 'string', 'exists:products,id'],
            'regenerate_key' => ['sometimes', 'boolean'],
        ]);

        foreach (['status', 'type', 'expiry_date', 'max_activations', 'user_id', 'product_id'] as $field) {
            if (array_key_exists($field, $data)) {
                $license->{$field} = $data[$field];
            }
        }
        if (!empty($data['regenerate_key'])) {
            $license->key = $this->generateLicenseKey();
        }
        $license->save();

        return back()->with('success', 'Licence mise à jour');
    }

    public function destroy(License $license)
    {
        $license->delete();
        return back()->with('success', 'Licence supprimée');
    }

    protected function generateLicenseKey(int $segments = 5, int $length = 4): string
    {
        $parts = [];
        for ($i = 0; $i < $segments; $i++) {
            $parts[] = strtoupper(Str::random($length));
        }
        return implode('-', $parts);
    }
}
