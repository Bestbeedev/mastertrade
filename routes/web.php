<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\LicenseController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\Client\HelpController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Client\CatalogueController;
use App\Http\Controllers\Client\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//Routes Dashboard protégées, accessibles uniquement aux utilisateurs authentifiés et vérifiés
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

//Routes Notifications
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
});

// Routes pour les logiciels téléchargés
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('downloads', [DownloadController::class, 'index'])->name('downloads');
});

//Routes pour les catalogues
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('catalogs', [CatalogueController::class, 'index'])->name('catalogs');
});

//Routes pour les formations
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('courses',[CourseController::class, 'index'])->name('courses');
});

//Routes pour les licenses
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('licenses', [LicenseController::class, 'index'])->name('licenses');
});

//Routes pour les commandes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('orders', [OrderController::class, 'index'])->name('orders');
});

//Routes pour les helps
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('helps', [HelpController::class, 'index'])->name('helps');
});

//Routes pour les support-tickets
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('supportsTickets', [TicketController::class, 'index'])->name('supportsTickets');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
