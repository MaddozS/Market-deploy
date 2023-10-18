<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicationsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function (){
    Route::put('profile/update', [AuthController::class, 'update']);

    Route::post('publications/create', [PublicationsController::class, 'create']);
    Route::get('publications', [PublicationsController::class, 'mainPage']);
    Route::get('publications/{idPublication}', [PublicationsController::class, 'getPublication']);
    Route::get('publications/profile/{matricula}', [PublicationsController::class, 'getSellerProfile']);
    Route::put('publications', [PublicationsController::class, 'update']);
    Route::delete('publications/{idPublication}', [PublicationsController::class, 'delete']);
    
    Route::post('logout', [AuthController::class, 'logout']);
});
