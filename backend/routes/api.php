<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\PelanggaranController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\DudiController;

// Public routes (no authentication required)
Route::apiResource('siswa', SiswaController::class)->only(['index', 'show']);
Route::apiResource('kelas', KelasController::class)->only(['index', 'show']);

// Authentication routes
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/verify-token', [AuthController::class, 'verifyToken'])->middleware('auth:sanctum');

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Student management (create, update, delete)
    Route::apiResource('siswa', SiswaController::class)->except(['index', 'show']);
    Route::apiResource('kelas', KelasController::class)->except(['index', 'show']);

    // Violation management
    Route::apiResource('pelanggaran', PelanggaranController::class);
    Route::get('/bukti/{id}/view', [PelanggaranController::class, 'getBuktiFile']);
    Route::get('/bukti/{id}/download', [PelanggaranController::class, 'downloadBuktiFile']);
    Route::get('/bukti/image/{id}', [PelanggaranController::class, 'getBuktiImage']);

    // Logbook management
    Route::apiResource('logbook', LogbookController::class);
    Route::patch('/logbook/{id}/status', [LogbookController::class, 'updateStatus']);
    Route::get('/logbook/siswa/{siswaId}', [LogbookController::class, 'getBySiswa']);

    // DUDI management
    Route::apiResource('dudi', DudiController::class);
    Route::get('/dudi/bidang/{bidang}', [DudiController::class, 'getByBidangUsaha']);
});
