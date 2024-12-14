<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\AdminUser;

class VerifyAuthToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('auth_token');

        // Validate token (you can customize this validation logic)
        if (!$token || !AdminUser::where('auth_token', $token)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get the response and set the CORS header
        $response = $next($request);


        return $response;
    }
}
