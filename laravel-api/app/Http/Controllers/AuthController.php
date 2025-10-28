<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\RefreshToken;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        return response()->json([
            'message' => 'Registration successful. Please verify your email before logging in.'
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        // find user by email
        $user = User::where('email', $request->email)->first();
        // check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // force logout previous session
        $user->tokens()->delete();
        $user->refreshTokens()->delete();

        // 1️⃣ create token (including role info in token name) [short-lived]
        $token = $user->createToken($user->role . '_token')->plainTextToken;

        // 2️⃣ create refresh token and store it in the database [long-lived]
        $refreshToken = Str::random(64);

        $user->refreshTokens()->create([
            'token' => hash('sha256', $refreshToken),
            'expires_at' => Carbon::now()->addDays(30) // DB
        ]);

        // 3️⃣ return response with:
        // - access token in JSON
        // - refresh token as HTTPOnly cookie
        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'role' => $user->role,
            'access_token' => $token,
        ], 200)->cookie(
            'refresh_token',
            $refreshToken,
            43200, // 30 days
            '/',   // path
            null,  // domain
            false, // ❗ MUST be false on localhost
            true,  // httpOnly
            false, // raw
            'Lax'  // sameSite (use "None" only if HTTPS)
        );
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['message' => 'No refresh token provided'], 401);
        }

        $hashed = hash('sha256', $refreshToken);


        $tokenRecord = RefreshToken::where('token', $hashed)
            ->where('expires_at', '>', now())
            ->first();

        if (!$tokenRecord) {
            return response()->json(['message' => 'Invalid or expired refresh token'], 401);
        }

        $user = $tokenRecord->user;

        // delete old access tokens
        $user->tokens()->delete();

        // create new access token
        $newAccessToken = $user->createToken($user->role . '_token')->plainTextToken;

        return response()->json([
            'access_token' => $newAccessToken
        ]);
    }


    public function logout(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        // $user->currentAccessToken()->delete();
        $request->user()->tokens()->delete();
        $user->refreshTokens()->delete();

        return response()->json([
            "message" => "Logged out successfully."
        ], 200)->withoutCookie('refresh_token');
    }
}
