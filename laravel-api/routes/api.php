<?php

use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// public routes
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

// authenticated routes (any logged-in user)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/menu', [ItemController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::get('/user', function (Request $request) {
        return response()->json(['user' => $request->user()], 200);
    });
});

// user-only routes
Route::middleware(['auth:sanctum', 'role:user'])->prefix('user')->group(function () {
    // orders
    Route::apiResource('orders', \App\Http\Controllers\User\OrderController::class);

    Route::get('cart', [\App\Http\Controllers\User\CartController::class, 'index']);
    Route::post('cart/add', [\App\Http\Controllers\User\CartController::class, 'add']);
    Route::put('cart/update/{itemId}', [\App\Http\Controllers\User\CartController::class, 'update']);
    Route::delete('cart/remove/{itemId}', [\App\Http\Controllers\User\CartController::class, 'remove']);
    Route::delete('cart/clear', [\App\Http\Controllers\User\CartController::class, 'clear']);
});

// admin only
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Admin - create item
    Route::post('/items', [ItemController::class, 'store']);
    Route::delete('/items/{id}', [ItemController::class, 'destroy']);
    Route::patch('/items/{id}', [ItemController::class, 'update']);

    // Recent orders endpoint used by the admin dashboard (latest N)
    Route::get('orders/recent', [\App\Http\Controllers\Admin\OrderController::class, 'recent']);

    // orders
    Route::apiResource('orders', \App\Http\Controllers\Admin\OrderController::class)
        ->only(['index', 'show', 'update', 'destroy']);
});
