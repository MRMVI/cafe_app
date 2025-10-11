<?php

use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// current user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'user' => $request->user()
    ], 200);
});

// authentication
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/refresh', 'refresh');
});

// protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// admin only
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Admin - create item
    Route::post('/admin/items', [ItemController::class, 'store']);
    Route::get('/admin/items', [ItemController::class, 'index']);
    Route::delete("/admin/items/{id}", [ItemController::class, 'destroy']);
    Route::patch("/admin/items/{id}", [ItemController::class, 'update']);
});
