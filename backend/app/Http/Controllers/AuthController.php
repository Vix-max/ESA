<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminUser;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    // Admin login function
    public function adminLogin(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = AdminUser::where('username', $request->username)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            // Generate a token
            $token = bin2hex(random_bytes(32));

            // Save token to the database
            $user->auth_token = $token;
            $user->save();

            return response()->json([
                'message' => 'Login successful',
                'role' => $user->role,
            ])
            ->cookie('auth_token', $token, 60, '/', null, null, false)
            ->cookie('adminName', $user->full_name, 60, '/', null, null, false);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }


    // Admin logout function
    public function adminLogout(Request $request)
{
    $token = $request->cookie('auth_token');

    if ($token) {
        // Optionally revoke the token if using Passport or Sanctum
        $user = Auth::guard('web')->user();
        if ($user) {
            $user->tokens()->delete(); // For Passport/Sanctum
        }

        Auth::guard('web')->logout();

        return response()->json(['message' => 'Logout successful'])
            ->withoutCookie('auth_token');
    }

    return response()->json(['message' => 'Not authenticated'], 401);
}

}
