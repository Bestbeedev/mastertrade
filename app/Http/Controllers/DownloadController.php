<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Download;
use App\Models\Product;
use App\Models\License;
use App\Models\Order;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class DownloadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();
        $history = Download::with('product:id,name,version')
            ->where('user_id', $userId)
            ->orderByDesc('timestamp')
            ->limit(50)
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->id,
                    'product' => [
                        'id' => $d->product_id,
                        'name' => optional($d->product)->name,
                        'version' => optional($d->product)->version,
                    ],
                    'file_version' => $d->file_version,
                    'downloaded_at' => (string) $d->timestamp,
                    'ip' => $d->ip_address,
                ];
            });

        return Inertia::render('client/download', [
            'history' => $history,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Download $download)
    {
        //
    }

    public function software()
    {
        return Inertia::render('client/download');
    }

    public function documents()
    {
        return Inertia::render('client/download');
    }

    public function updates()
    {
        return Inertia::render('client/download');
    }

    /**
     * Start a product download: log it and proxy stream the Google Drive file.
     */
    public function start(Product $product, Request $request)
    {
        // Ensure a download URL is configured
        if (!$product->download_url) {
            abort(404, 'Fichier non disponible');
        }

        $userId = Auth::id();

        // Eligibility rules
        $requires = (bool) ($product->requires_license ?? false);
        $isPaid = (int) ($product->price_cents ?? 0) > 0;
        $hasActiveLicense = License::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expiry_date')->orWhere('expiry_date', '>', now());
            })
            ->exists();
        $hasPaidOrder = Order::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->where('status', 'paid')
            ->exists();

        $eligible = ($requires && $hasActiveLicense)
            || (!$requires && $isPaid && $hasPaidOrder)
            || (!$requires && !$isPaid);

        abort_unless($eligible, 403, 'Accès au téléchargement non autorisé pour ce produit.');

        $license = null;
        if ($hasActiveLicense) {
            $license = License::where('user_id', $userId)
                ->where('product_id', $product->id)
                ->where('status', 'active')
                ->where(function ($q) {
                    $q->whereNull('expiry_date')->orWhere('expiry_date', '>', now());
                })
                ->first();
        }

        // Log download
        $download = Download::create([
            'user_id' => $userId,
            'product_id' => $product->id,
            'license_id' => $license?->id,
            'ip_address' => (string) $request->ip(),
            'user_agent' => (string) ($request->userAgent() ?? ''),
            'file_version' => (string) ($product->version ?? ''),
            'timestamp' => now(),
        ]);

        // Create a notification for the user
        if ($userId) {
            Notification::create([
                'user_id' => $userId,
                'type' => 'download',
                'data' => [
                    'title' => 'Téléchargement démarré',
                    'message' => ($product->name ?? 'Produit') . ($product->version ? (' v' . $product->version) : ''),
                    'download_id' => $download->id,
                ],
            ]);
        }

        // Build direct Drive download URL
        $fileId = $this->extractDriveFileId($product->download_url);
        if (!$fileId) {
            // Fallback: redirect to provided URL
            return redirect()->away($product->download_url);
        }
        $directUrl = "https://drive.google.com/uc?export=download&id={$fileId}";

        // Stream via proxy so user stays on our domain
        try {
            $response = Http::withOptions(['stream' => true, 'verify' => false])->get($directUrl);
            if ($response->failed()) {
                return redirect()->away($directUrl);
            }

            $contentType = $response->header('Content-Type') ?: 'application/octet-stream';
            $disposition = $response->header('Content-Disposition');
            $suggestedName = Str::slug($product->name ?: 'logiciel') . (!empty($product->version) ? ('-v' . $product->version) : '');
            $ext = $this->guessExtensionFromHeaders($disposition, $contentType) ?: '';
            $filename = $this->extractFilenameFromDisposition($disposition) ?: ($suggestedName . ($ext ? ('.' . $ext) : ''));
            $psr = $response->toPsrResponse();
            $stream = $psr->getBody();

            return response()->streamDownload(function () use ($stream) {
                while (!$stream->eof()) {
                    echo $stream->read(1024 * 1024);
                    flush();
                }
            }, $filename, [
                'Content-Type' => $contentType,
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Content-Disposition' => 'attachment; filename="' . addslashes($filename) . '"',
            ]);
        } catch (\Throwable $e) {
            // If streaming fails, redirect to Drive as last resort
            return redirect()->away($directUrl);
        }
    }

    public function download(Download $download)
    {
        return response()->json(['ok' => true, 'download_id' => $download->id]);
    }

    public function recent()
    {
        return response()->json([
            ['id' => 1, 'name' => 'MasterAdogbe v2.1', 'downloaded_at' => now()->toISOString()],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Download $download)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Download $download)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Download $download)
    {
        //
    }

    private function extractDriveFileId(?string $url): ?string
    {
        if (!$url) return null;
        if (preg_match('#/file/d/([^/]+)/#', $url, $m)) {
            return $m[1] ?? null;
        }
        $parts = parse_url($url);
        if (!empty($parts['query'])) {
            parse_str($parts['query'], $q);
            if (!empty($q['id'])) return (string) $q['id'];
        }
        return null;
    }

    private function extractFilenameFromDisposition(?string $disposition): ?string
    {
        if (!$disposition) return null;
        // Use double-quoted PHP string and escape internal quotes properly
        if (preg_match("/filename\*=UTF-8''([^;]+)|filename=\"?([^\";]+)\"?/i", $disposition, $m)) {
            return isset($m[2]) && $m[2] !== '' ? $m[2] : (isset($m[1]) ? urldecode($m[1]) : null);
        }
        return null;
    }

    private function guessExtensionFromHeaders(?string $disposition, string $contentType): ?string
    {
        $map = [
            'application/zip' => 'zip',
            'application/x-zip-compressed' => 'zip',
            'application/pdf' => 'pdf',
            'application/vnd.ms-msi' => 'msi',
            'application/x-msdownload' => 'exe',
            'application/octet-stream' => null,
            'application/x-7z-compressed' => '7z',
            'application/x-rar-compressed' => 'rar',
            'application/x-apple-diskimage' => 'dmg',
            'application/x-xar' => 'pkg',
            'application/gzip' => 'gz',
        ];
        if (!empty($disposition)) {
            $name = $this->extractFilenameFromDisposition($disposition);
            if ($name && str_contains($name, '.')) {
                $ext = pathinfo($name, PATHINFO_EXTENSION);
                return $ext ?: null;
            }
        }
        return $map[$contentType] ?? null;
    }
}
