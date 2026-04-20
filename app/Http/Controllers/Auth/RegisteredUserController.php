<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register', ['title' => 'Register']);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        UserRole::create([
            'user_id' => $user->id,
            'role_id' => 2,
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('verification.notice');
    }

    public function email()
    {
        return view('auth.verify-email');
    }

    public function profile()
    {
        return view('auth.profile',['title'=> 'Profile Completion']);
    }

    public function profile_update(Request $request)
    {
        $user = User::findOrFail(Auth::user()->id);
        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->mother_name = $request->mother_name;
        $user->gender = $request->gender;
        $user->marital_status = $request->marital_status;
        $user->birth_date = $request->birth_date;
        $user->save();
        return redirect()->route('user.dashboard');
    }
}
