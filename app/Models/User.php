<?php

namespace App\Models;

use App\Models\Role;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'status',
        'profile_picture',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function isProfileComplete(): bool
    {
        return !empty($this->name) && !empty($this->phone);
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()->whereRaw('LOWER(name) = ?', [strtolower($role)])->exists();
    }

    public function redirectTo()
    {
        if (!$this->isProfileComplete() && $this->hasRole('user')) {
            return route('user.complete.profile');
        }

        if ($this->hasRole('admin')) {
            return route('admin.dashboard');
        }

        return route('user.dashboard');
    }

    protected static function booted()
    {
        static::created(function ($user) {
            $user->wallet()->create([
                'balance' => 0,
                'status' => 'ACTIVE'
            ]);
        });
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }
}
