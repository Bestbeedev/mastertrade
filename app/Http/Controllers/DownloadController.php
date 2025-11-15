<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Download;
use Illuminate\Http\Request;

class DownloadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('client/download');
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
}
