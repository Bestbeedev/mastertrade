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
use App\Http\Controllers\Client\SearchController;
use App\Http\Controllers\Client\BillingController;
use App\Http\Controllers\Client\CatalogueController;
use App\Http\Controllers\Client\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Routes Dashboard protégées, accessibles uniquement aux utilisateurs authentifiés et vérifiés
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Routes Notifications
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

// Routes pour les logiciels téléchargés
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('downloads', [DownloadController::class, 'index'])->name('downloads');
    Route::get('downloads/software', [DownloadController::class, 'software'])->name('downloads.software');
    Route::get('downloads/documents', [DownloadController::class, 'documents'])->name('downloads.documents');
    Route::get('downloads/updates', [DownloadController::class, 'updates'])->name('downloads.updates');
    Route::post('downloads/{download}/download', [DownloadController::class, 'download'])->name('downloads.download');
});

// Routes pour les catalogues
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('catalogs', [CatalogueController::class, 'index'])->name('catalogs');
    Route::get('catalogs/{product}', [CatalogueController::class, 'show'])->name('catalogs.show');
    Route::post('catalogs/{product}/purchase', [CatalogueController::class, 'purchase'])->name('catalogs.purchase');
    Route::get('catalogs/category/{category}', [CatalogueController::class, 'byCategory'])->name('catalogs.category');
});

// Routes pour les formations
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('courses', [CourseController::class, 'index'])->name('courses');
    Route::get('all-courses', [CourseController::class, 'allcourses'])->name('all-courses');
    Route::get('courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::get('courses/{course}/content', [CourseController::class, 'content'])->name('courses.content');
    Route::post('courses/{course}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
    Route::post('courses/{course}/complete-lesson', [CourseController::class, 'completeLesson'])->name('courses.complete-lesson');
    Route::get('courses/{course}/certificate', [CourseController::class, 'certificate'])->name('courses.certificate');
    Route::get('my-courses', [CourseController::class, 'myCourses'])->name('courses.my-courses');
    Route::get('course-progress', [CourseController::class, 'progress'])->name('courses.progress');
});

// Routes pour les licenses
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('licenses', [LicenseController::class, 'index'])->name('licenses');
    Route::post('licenses', [LicenseController::class, 'store'])->name('licenses.create');
    Route::get('licenses/{license}', [LicenseController::class, 'show'])->name('licenses.show');
    Route::put('licenses/{license}', [LicenseController::class, 'update'])->name('licenses.update');
    Route::post('licenses/{license}/renew', [LicenseController::class, 'renew'])->name('licenses.renew');
    Route::post('licenses/{license}/extend', [LicenseController::class, 'extend'])->name('licenses.extend');
    Route::get('licenses/{license}/certificate', [LicenseController::class, 'certificate'])->name('licenses.certificate');
});

// Routes pour les commandes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('orders', [OrderController::class, 'index'])->name('orders');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('orders/{order}/refund', [OrderController::class, 'refund'])->name('orders.refund');
});

// Routes pour l'aide
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('helps', [HelpController::class, 'index'])->name('helps');
    Route::get('helps/faq', [HelpController::class, 'faq'])->name('helps.faq');
    Route::get('helps/documentation', [HelpController::class, 'documentation'])->name('helps.documentation');
    Route::get('helps/tutorials', [HelpController::class, 'tutorials'])->name('helps.tutorials');
    Route::get('helps/articles/{article}', [HelpController::class, 'article'])->name('helps.article');
    Route::get('helps/search', [HelpController::class, 'search'])->name('helps.search');
});

// Routes pour les tickets de support
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('supportsTickets', [TicketController::class, 'index'])->name('supportsTickets');
    Route::get('supportsTickets/create', [TicketController::class, 'create'])->name('supportsTickets.create');
    Route::post('supportsTickets', [TicketController::class, 'store'])->name('supportsTickets.store');
    Route::get('supportsTickets/{ticket}', [TicketController::class, 'show'])->name('supportsTickets.show');
    Route::put('supportsTickets/{ticket}', [TicketController::class, 'update'])->name('supportsTickets.update');
    Route::post('supportsTickets/{ticket}/reply', [TicketController::class, 'reply'])->name('supportsTickets.reply');
    Route::post('supportsTickets/{ticket}/close', [TicketController::class, 'close'])->name('supportsTickets.close');
    Route::post('supportsTickets/{ticket}/reopen', [TicketController::class, 'reopen'])->name('supportsTickets.reopen');
});


// Routes pour les paiements et facturation
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('billing', [BillingController::class, 'index'])->name('billing');
    Route::get('billing/invoices', [BillingController::class, 'invoices'])->name('billing.invoices');
    Route::get('billing/invoices/{invoice}', [BillingController::class, 'invoice'])->name('billing.invoice');
    Route::get('billing/payment-methods', [BillingController::class, 'paymentMethods'])->name('billing.payment-methods');
    Route::post('billing/payment-methods', [BillingController::class, 'storePaymentMethod'])->name('billing.payment-methods.store');
    Route::delete('billing/payment-methods/{paymentMethod}', [BillingController::class, 'destroyPaymentMethod'])->name('billing.payment-methods.destroy');
});

// Routes API pour les fonctionnalités dynamiques
Route::middleware(['auth', 'verified'])->group(function () {
    // Recherche globale
    Route::get('api/search', [SearchController::class, 'index'])->name('api.search');

    // Statistiques dashboard
    Route::get('api/dashboard/stats', [DashboardController::class, 'stats'])->name('api.dashboard.stats');

    // Téléchargements
    Route::get('api/downloads/recent', [DownloadController::class, 'recent'])->name('api.downloads.recent');

    // Progression des formations
    Route::get('api/courses/progress', [CourseController::class, 'progressData'])->name('api.courses.progress');

    // Notifications en temps réel
    Route::get('api/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('api.notifications.unread-count');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
