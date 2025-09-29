<?php

use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Admin - create item
    Route::post('/admin/items', [ItemController::class, 'store']);
});
