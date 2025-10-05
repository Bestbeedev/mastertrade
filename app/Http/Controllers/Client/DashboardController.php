<?php

namespace App\Http\Controllers\Client;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Passe le user connecté à la vue Inertia
        $authUser = auth()->user()->only(['id', 'name', 'email', 'role_id', 'country', 'phone']);
        return Inertia::render('dashboard', [
            'user_data' => $authUser, // <--- user connecté
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    /// Passe le user connecté à la vue Inertia
    public function getCurrentUser()
    {
        return inertia('Dashboard', [
            'auth_user' => auth()->user(), // <--- user connecté
        ]);
    }
}
