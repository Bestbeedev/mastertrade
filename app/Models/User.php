<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\UuidTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, UuidTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'country',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function licenses()
    {
        return $this->hasMany(License::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function downloads()
    {
        return $this->hasMany(Download::class);
    }
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
    public static function isAdmin()
    {
        $user = Auth::user();
        $isAdmin = $user && $user->role && in_array(strtolower($user->role->name), ['admin', 'administrator', 'superadmin']);
        return $isAdmin;
    }

}
