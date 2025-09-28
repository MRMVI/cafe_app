<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


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
        // find user
        $user = User::where('email', $request->email)->first();
        // check credentials
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password'
            ], 401);
        }
        // create token (including role info in token name)
        $token = $user->createToken($user->role . '_token')->plainTextToken;

        // return response

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => $user,
            'role' => $user->role,
            'token' => $token
        ], 200);
    }
}
