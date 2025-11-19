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
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\Admin\LicenseAdminController;
use App\Http\Controllers\Admin\HelpAdminController;
use App\Models\Product;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use App\Models\License;
use App\Models\Order as OrderModel;
use App\Models\Ticket;
use App\Models\Download as DownloadModel;
use Illuminate\Support\Carbon;

Route::get('/', function () {
    $products = Product::select([
        'id',
        'name',
        'version',
        'category',
        'description',
        'size',
        'changelog',
        'features',
        'created_at',
        'updated_at',
        'download_url',
    ])
        ->latest()
        ->take(10)
        ->get();

    return Inertia::render('welcome', [
        'products' => $products,
    ]);
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
    Route::get('downloads/start/{product}', [DownloadController::class, 'start'])->name('downloads.start');
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

// Activation de licences (auth requis, PAS besoin de verified pour ne pas casser le flux)
Route::middleware(['auth'])->group(function () {
    // Placer ces routes statiques AVANT la route dynamique licenses/{license}
    Route::get('licenses/activate', [LicenseController::class, 'activationStart'])->name('licenses.activation.start');
    Route::post('licenses/checkout', [LicenseController::class, 'activationCheckout'])->name('licenses.activation.checkout');
    Route::get('licenses/activate/complete/{license}', [LicenseController::class, 'activationComplete'])->whereUuid('license')->name('licenses.activation.complete');
});

// Routes pour les licenses
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('licenses', [LicenseController::class, 'index'])->name('licenses');
    Route::post('licenses', [LicenseController::class, 'store'])->name('licenses.create');
    Route::get('licenses/{license}', [LicenseController::class, 'show'])->whereUuid('license')->name('licenses.show');
    Route::put('licenses/{license}', [LicenseController::class, 'update'])->name('licenses.update');
    Route::post('licenses/{license}/renew', [LicenseController::class, 'renew'])->name('licenses.renew');
    Route::post('licenses/{license}/extend', [LicenseController::class, 'extend'])->name('licenses.extend');
    Route::get('licenses/{license}/certificate', [LicenseController::class, 'certificate'])->whereUuid('license')->name('licenses.certificate');
});

// Routes pour les commandes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('orders', [OrderController::class, 'index'])->name('orders');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
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

    // Paiements
    Route::post('api/payments/initiate', [PaymentController::class, 'initiate'])->name('api.payments.initiate');
    Route::post('api/payments/webhook', [PaymentController::class, 'webhook'])->name('api.payments.webhook');


    // Produits (API minimale)
    Route::get('api/products', [ProductController::class, 'index'])->name('api.products');
    Route::get('api/products/{product}', [ProductController::class, 'show'])->name('api.products.show');
});

// Validation de licence (publique pour l'app WinDev; ajoutez throttle/cors si besoin)
Route::post('api/license/validate', [LicenseController::class, 'validateKey'])->name('api.license.validate');

// Routes Admin (Inertia pages)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('admin', function () {
        $productsCount = Product::count();
        $coursesCount = Course::count();
        $usersCount = User::count();
        $licensesCount = License::count();
        $licensesActiveCount = License::where('status', 'active')->count();
        $since = Carbon::now()->subDays(30);
        $ordersLast30 = OrderModel::where('created_at', '>=', $since)->count();
        $revenueCents30 = (int) OrderModel::where('created_at', '>=', $since)->sum('amount');
        $ticketsCount = Ticket::count();
        $ticketsOpen = Ticket::where('status', 'open')->count();
        $downloads30 = DownloadModel::where('timestamp', '>=', $since)->count();
        $renewalsDue30 = License::where('status', 'active')
            ->whereDate('expiry_date', '>=', Carbon::today())
            ->whereDate('expiry_date', '<=', Carbon::today()->addDays(30))
            ->count();

        $courseEnrollments30 = CourseEnrollment::where('started_at', '>=', $since)->count();
        $avgCourseProgress = (int) round((float) (CourseEnrollment::avg('progress_percent') ?? 0));

        $topProducts30 = OrderModel::where('created_at', '>=', $since)
            ->selectRaw('product_id, COUNT(*) as orders_count, SUM(amount) as revenue_cents')
            ->groupBy('product_id')
            ->orderByDesc('revenue_cents')
            ->with(['product:id,name'])
            ->take(5)->get();

        $recentProducts = Product::select(['id', 'name', 'sku', 'version', 'category', 'created_at'])
            ->latest()->take(5)->get();
        $recentCoursesList = Course::select(['id', 'title', 'created_at'])
            ->latest()->take(5)->get();

        // Données pour les graphiques
        $days = collect(range(29, 0))->map(function ($daysAgo) {
            return [
                'date' => now()->subDays($daysAgo)->format('Y-m-d'),
                'date_formatted' => now()->subDays($daysAgo)->format('d M'),
            ];
        });

        // Données des commandes par jour
        $ordersByDay = OrderModel::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', $since)
            ->groupBy('date')
            ->pluck('count', 'date');

        // Données des revenus par jour
        $revenueByDay = OrderModel::selectRaw('DATE(created_at) as date, SUM(amount) as total')
            ->where('created_at', '>=', $since)
            ->groupBy('date')
            ->pluck('total', 'date');

        // Données des téléchargements par jour
        $downloadsByDay = DownloadModel::selectRaw('DATE(timestamp) as date, COUNT(*) as count')
            ->where('timestamp', '>=', $since)
            ->groupBy('date')
            ->pluck('count', 'date');

        // Préparation des données pour les graphiques
        $chartData = $days->map(function ($day) use ($ordersByDay, $revenueByDay, $downloadsByDay) {
            return [
                'date' => $day['date'],
                'orders' => $ordersByDay[$day['date']] ?? 0,
                'revenue' => ($revenueByDay[$day['date']] ?? 0) / 100, // Convertir en euros
                'downloads' => $downloadsByDay[$day['date']] ?? 0,
            ];
        });

        $recentOrders = OrderModel::with(['product:id,name', 'user:id,name'])
            ->latest()->take(5)
            ->get(['id', 'product_id', 'user_id', 'status', 'amount', 'created_at']);
        $recentTickets = Ticket::with(['user:id,name'])
            ->latest()->take(5)
            ->get(['id', 'subject', 'status', 'created_at', 'user_id']);
        $recentLicenses = License::with(['product:id,name', 'user:id,name'])
            ->latest()->take(5)
            ->get(['id', 'product_id', 'user_id', 'status', 'expiry_date', 'created_at']);

        return Inertia::render('admin/index', [
            'adminStats' => [
                'products' => $productsCount,
                'courses' => $coursesCount,
                'users' => $usersCount,
                'licenses' => [
                    'total' => $licensesCount,
                    'active' => $licensesActiveCount,
                ],
                'orders_30d' => $ordersLast30,
                'revenue_cents_30d' => $revenueCents30,
                'downloads_30d' => $downloads30,
                'renewals_due_30d' => $renewalsDue30,
                'tickets' => [
                    'total' => $ticketsCount,
                    'open' => $ticketsOpen,
                ],
                'course_enrollments_30d' => $courseEnrollments30,
                'avg_course_progress' => $avgCourseProgress,
            ],
            'recentOrders' => $recentOrders,
            'recentTickets' => $recentTickets,
            'recentLicenses' => $recentLicenses,
            'topProducts30' => $topProducts30,
            'recentProducts' => $recentProducts,
            'recentCourses' => $recentCoursesList,
            'chartData' => $chartData,
        ]);
    })->name('admin');

    // Admin Users Management
    Route::get('admin/users', [UserAdminController::class, 'index'])->name('admin.users');
    Route::post('admin/users', [UserAdminController::class, 'store'])->name('admin.users.store');
    Route::patch('admin/users/{user}', [UserAdminController::class, 'update'])->name('admin.users.update');
    Route::delete('admin/users/{user}', [UserAdminController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('admin/courses', function () {
        $courses = Course::with('product:id,name')
            ->select(['id', 'title', 'description', 'is_paid', 'price', 'product_id', 'cover_image', 'duration_seconds', 'created_at'])
            ->withCount(['modules', 'lessons', 'enrollments'])
            ->latest()->get();
        $products = Product::select(['id', 'name'])->orderBy('name')->get();
        return Inertia::render('admin/courses', [
            'courses' => $courses,
            'products' => $products,
        ]);
    })->name('admin.courses');
    Route::post('admin/courses', [CourseController::class, 'store'])->name('admin.courses.store');
    Route::delete('admin/courses/{course}', [CourseController::class, 'destroy'])->name('admin.courses.destroy');
    Route::get('admin/courses/{course}', [CourseController::class, 'edit'])->name('admin.courses.edit');
    Route::patch('admin/courses/{course}', [CourseController::class, 'update'])->name('admin.courses.update');

    Route::get('admin/products', function () {
        $products = Product::select([
            'id',
            'name',
            'sku',
            'version',
            'download_url',
            'category',
            'description',
            'size',
            'checksum',
            'changelog',
            'features',
            'created_at',
        ])
            ->latest()
            ->get();

        return Inertia::render('admin/products', [
            'products' => $products,
        ]);
    })->name('admin.products');
    Route::post('admin/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::patch('admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

    // Admin Licenses Management
    Route::get('admin/licenses', [LicenseAdminController::class, 'index'])->name('admin.licenses');
    Route::post('admin/licenses', [LicenseAdminController::class, 'store'])->name('admin.licenses.store');
    Route::patch('admin/licenses/{license}', [LicenseAdminController::class, 'update'])->name('admin.licenses.update');
    Route::delete('admin/licenses/{license}', [LicenseAdminController::class, 'destroy'])->name('admin.licenses.destroy');

    // Admin Help Articles
    Route::get('admin/help-articles', [HelpAdminController::class, 'index'])->name('admin.help-articles');
    Route::post('admin/help-articles', [HelpAdminController::class, 'store'])->name('admin.help-articles.store');
    Route::patch('admin/help-articles/{article}', [HelpAdminController::class, 'update'])->name('admin.help-articles.update');
    Route::delete('admin/help-articles/{article}', [HelpAdminController::class, 'destroy'])->name('admin.help-articles.destroy');

    // Admin Downloads Logs
    Route::get('admin/downloads', function () {
        $logs = DownloadModel::with(['user:id,name,email', 'product:id,name,version'])
            ->orderByDesc('timestamp')
            ->take(300)
            ->get(['id', 'user_id', 'product_id', 'ip_address', 'user_agent', 'file_version', 'timestamp']);

        return Inertia::render('admin/downloads', [
            'logs' => $logs,
        ]);
    })->name('admin.downloads');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
