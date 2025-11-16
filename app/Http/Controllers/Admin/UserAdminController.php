<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserAdminController extends Controller
{
    public function index(Request $request)
    {
        $q = (string) $request->input('q', '');
        $users = User::with(['role:id,name'])
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($s) use ($q) {
                    $s->where('name', 'like', "%$q%")
                        ->orWhere('email', 'like', "%$q%");
                });
            })
            ->orderByDesc('created_at')
            ->take(100)
            ->get(['id', 'name', 'email', 'phone', 'country', 'role_id', 'created_at']);

        $roles = Role::select(['id', 'name'])->orderBy('name')->get();

        return Inertia::render('admin/users', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'q' => $q,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:50'],
            'country' => ['nullable', 'string', 'max:100'],
            'role_id' => ['nullable', 'string', 'exists:roles,id'],
        ]);

        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($data['password']);
        $user->phone = $data['phone'] ?? null;
        $user->country = $data['country'] ?? null;
        $user->role_id = $data['role_id'] ?? null;
        $user->save();

        return back()->with('success', 'Utilisateur créé');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id . ',id'],
            'password' => ['nullable', 'string', 'min:6'],
            'phone' => ['nullable', 'string', 'max:50'],
            'country' => ['nullable', 'string', 'max:100'],
            'role_id' => ['nullable', 'string', 'exists:roles,id'],
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->phone = $data['phone'] ?? null;
        $user->country = $data['country'] ?? null;
        $user->role_id = $data['role_id'] ?? null;
        $user->save();

        return back()->with('success', 'Utilisateur mis à jour');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'Utilisateur supprimé');
    }
}
