<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\http\Controllers\mejaController;
use App\http\Controllers\menuController;
use App\http\Controllers\transaksiController;
use App\http\Controllers\userController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/login',  [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

Route::group([ 'middleware' => ['jwt.verify']],function(){

    Route::group(['middleware' => ['api.manajer']], function(){
        Route::get('/getDetail/{id}', [transaksiController::class, 'getDetail']);
        Route::get('/filterTransaksiTgl', [transaksiController::class, 'filterTransaksiTgl']);
        Route::get('/filterTransaksiNama', [transaksiController::class, 'filterTransaksiNama']);
        Route::post('/filterTransaksiKasir', [transaksiController::class, 'filterTransaksiKasir']);
        Route::get('/transaksi',  [transaksiController::class, 'index']);
    });

    Route::group(['middleware' => ['api.kasir']], function(){
        Route::post('/transaksi',  [transaksiController::class, 'store']);
        Route::get('/mejaKosong',  [mejaController::class, 'statusKosong']);
        Route::get('/menu',  [menuController::class, 'index']);
        Route::get('/menuKasir',  [menuController::class, 'index']);
        Route::get('/getDetail/{id}', [transaksiController::class, 'getDetail']);        
        Route::post('/logout',  [UserController::class, 'logout']);
        Route::get('/user', [UserController::class, 'getAuthenticatedUser']);
        Route::get('/getByKasir/{id}', [transaksiController::class, 'getByKasir']); 
        Route::post('/pembayaran/{id}', [transaksiController::class, 'pembayaran']);      
    });
    
    Route::group(['middleware' => ['api.admin']], function(){
        //admin meja
        Route::post('/meja',  [mejaController::class, 'store']);
        Route::post('/meja/{id}',  [mejaController::class, 'updateMeja']);
        Route::get('/meja',  [mejaController::class, 'index']);
        Route::delete('/meja/{id}',  [mejaController::class, 'destroy']);

        //admin user
        Route::get('/getUser', [UserController::class, 'getUser']);
        Route::post('/createUser', [UserController::class, 'store']);
        Route::post('/updateUser/{id}', [UserController::class, 'updateUser']);
        Route::delete('/deleteUser/{id}', [UserController::class, 'destroy']);
        Route::post('/searchUser',  [userController::class, 'search']);


        //admin menu
        Route::post('/menu/{id}',  [menuController::class, 'updateMenu']);
        Route::post('/searchMenu',  [menuController::class, 'search']);
        Route::get('/menu',  [menuController::class, 'index']);
        Route::post('/menu',  [menuController::class, 'store']);
        Route::delete('/menu/{id}',  [menuController::class, 'destroy']);

    });
});

Route::get('/getDetail/{id}', [transaksiController::class, 'getDetail']);
Route::post('/filterTransaksiTgl', [transaksiController::class, 'filterTransaksiTgl']);
Route::get('/filterTransaksiNama', [transaksiController::class, 'filterTransaksiNama']);
Route::post('/filterTransaksiKasir', [transaksiController::class, 'filterTransaksiKasir']);
Route::get('/transaksi',  [transaksiController::class, 'index']);
Route::get('/getKasir', [UserController::class, 'getKasir']);








