<?php

use App\Http\Controllers\Configuration\AccessRoleController;
use App\Http\Controllers\Configuration\MenuController;
use App\Http\Controllers\Configuration\PermissionController;
use App\Http\Controllers\Configuration\RoleController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('configuration')->name('configuration.')->group(function () {
        Route::resource('menu', MenuController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('access-role', AccessRoleController::class)->except(['create', 'store', 'delete'])->parameters(['access-role' => 'role']);
    });
});

require __DIR__ . '/settings.php';
