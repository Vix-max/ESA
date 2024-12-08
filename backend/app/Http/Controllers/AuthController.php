<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminUser;

class AuthController extends Controller
{
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

            // Respond with user details
            return response()->json([
                'token' => $token,
                'role' => $user->role,
                'fullName' => $user->full_name,
            ], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
