<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// Web authentication routes (fallback for web interface)
Route::get('/login', function () {
    return response()->json(['message' => 'Please use API login endpoint: POST /api/login']);
})->name('login');

Route::get('/register', function () {
    return response()->json(['message' => 'Please use API register endpoint: POST /api/register']);
})->name('register');
