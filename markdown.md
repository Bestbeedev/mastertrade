Projet : Mastertrade — plateforme web (Laravel + React) pour distribution et gestion de licences de logiciels SaaS créés avec WinDev.

1. Objectif

* Permettre aux clients d’acheter/télécharger des logiciels (exécutables), gérer licences et abonnements en temps réel, renouveler licences, consulter historiques et accéder à des formations (vidéos / PDFs).
* Fournir un panneau admin pour gérer produits, licences, utilisateurs, paiements et analytics.

2. Public cible

* Clients finaux (entreprises & particuliers) achetant licences.
* Admin / Équipe commerciale / Support technique.

3. Périmètre fonctionnel (MVP)

* Authentification (inscription, SSO optionnel, récupération mot de passe).
* Catalogue produits (logiciels) + pages produit.
* Achat / Paiement (intégration d’un PSP : KKiapay selon marché).
* Génération et gestion de licences (création, activation, renouvellement, révocation).
* Téléchargement sécurisé (liens signés, tokens, quotas).
* Dashboard utilisateur : statut licence, historique, renouvellement, téléchargements, accès formations achetées.
* Section formations (vidéos + PDFs) accessible selon droits.
* Panneau admin : gestion produits, licences, utilisateurs, commandes, logs.
* Notifications (email calculées, webhook pour paiements).
* Logging & audit de sécurité.
* Déploiement Docker / CI, sauvegardes.

4. Contraintes techniques & non-fonctionnelles

* Stack backend : Laravel 10 (PHP 8.2+), DB : MySQL ou PostgreSQL.
* Frontend : React (Vite ou Create React App), Tailwind CSS.
* Auth : JWT pour API + sessions pour UI. RBAC (user/admin/superadmin).
* Fichiers lourds (installateurs, vidéos) : stockage objet (S3 / Backblaze / DigitalOcean Spaces). Uploads chunkés si >100Mo.
* CDN pour distribution de fichiers.
* Sécurité : HTTPS obligatoire, chiffrement des clés, rate-limiting, protection brute-force, CSP, XSS/CSRF protections.
* Performances : cache (Redis), file d’attente (Laravel Queue), pagination API.
* Scalabilité : microservices non nécessaires au départ, architecture monolithique modulaire.
* Sauvegardes quotidiennes DB + snapshots S3.
* Conformité : GDPR (si applicable), logs de consentement.
* Monitoring : Sentry, métriques basiques (Prometheus/Datadog optionnel).

5. Livrables

* Code source (backend + frontend) + README d’installation.
* Database schema et scripts de migration.
* API REST/GraphQL doc (OpenAPI/Swagger).
* Déploiement Docker & pipeline CI (GitHub Actions/GitLab CI).
* Tests unitaires basiques et tests d’intégration.
* Manuel admin et guide utilisateur.
* MVP en production sur domaine choisi.

6. Critères d’acceptation MVP

* Un utilisateur peut acheter un produit et obtenir une licence active.
* L’utilisateur peut télécharger le logiciel via lien sécurisé.
* Admin peut voir/annuler/renouveler licences.
* Accès aux formations pour utilisateurs autorisés.
* Paiements reconnus et reliés à commandes/licences.
* Tests de sécurité de base passés, déploiement en staging prêt.


1. Utilisateurs & rôles

* Rôles : guest, user, support, admin, superadmin.
* Les admins voient tout ; support voit tickets et certains logs ; users voient uniquement leurs licences/achats.

2. Produits & licences

* Chaque produit a SKU, version, hash checksum du binaire, taille, changelog.
* Licence = clé unique (format e.g. `MT-<UUID>`), associée à : product_id, user_id (optionnel), status (active/expired/revoked/trial), type (permanent/subscription/seat-based), expiry_date, max_activations, activations_count, created_at, renewed_at.
* Génération : licence créée automatiquement après paiement confirmé.
* Activation : activation liée à un device_id ou machine fingerprint ; incrémente activations_count.
* Si activations_count > max_activations → refus d’activation (avec procédure support).
* Renouvellement : possible via paiement ou manuel par admin ; grace period configurable (ex. 7 jours).

3. Paiements & commandes

* Order : status (pending/paid/failed/refunded).
* Paiement confirmé → création d’une licence + envoi email.
* Remboursement possible sous conditions (7-14 jours) ; annule/mark licence revoked.

4. Téléchargements

* Liens de téléchargement signés, valides T minutes (configurable).
* Téléchargement contrôlé : check licence & order status avant délivrance.
* Logs : chaque téléchargement enregistré (user/ip/timestamp/file_version).

5. Formations (contenu e-learning)

* Les formations peuvent être gratuites ou payantes (liées à un produit ou achat séparé).
* Accès conditionné par role ou achat.
* Vidéos en streaming sécurisé (URLs signées) ; PDFs en accès restreint.

6. Notifications & alertes

* Emails sur actions majeures : achat, échec paiement, licence expirante (J-30, J-7, J-1), renouvellement réussi.
* Webhooks pour PSP afin d’automatiser statut des commandes.

7. Support & logs

* Tickets : lié à user, licence, order.
* Audit logs : actions admin sensibles (révocation de licence, remboursement).
* Retention logs : DB logs 1 an minimum.

8. Sécurité & tolérance

* Limites d’essai (trial) une seule par email/product.
* Blocklist d’IP en cas d’abus.
* Sauvegarde périodique.


(Format résumé : ClassName { attributs } + méthodes principales)

1. User {

* id, name, email, password_hash, phone, country, role_id, created_at, last_login

- register(), login(), resetPassword(), updateProfile(), hasAccess(resource)
  }

2. Role {

* id, name, permissions[]

- addPermission(), removePermission()
  }

3. Product {

* id, sku, title, description, version, price, file_path, checksum, thumbnail_url, created_at

- publish(), unpublish(), updateVersion()
  }

4. License {

* id, key, product_id, user_id, status, type, expiry_date, max_activations, activations_count, metadata

- activate(device_id), revoke(), renew(days), isValid(), timeToExpiry()
  }

5. Order {

* id, user_id, product_id, amount, currency, status, payment_id, created_at

- markPaid(), markFailed(), refund()
  }

6. Payment {

* id, order_id, provider, provider_reference, status, amount, currency, created_at

- validateWebhook(), capture(), refund()
  }

7. DownloadToken {

* id, file_id, user_id, token, expires_at, ip_restriction

- generate(), validate()
  }

8. Course {

* id, title, description, price, slug, published

- addLesson(), removeLesson()
  }

9. Lesson {

* id, course_id, title, type (video/pdf), asset_url, duration

- markComplete(user_id)
  }

10. VideoAsset {

* id, lesson_id, s3_key, thumbnail_key, duration, size

- getSignedUrl(expiry)
  }

11. Activation (act de licence) {

* id, license_id, device_id, ip, country, created_at

- record()
  }

12. AuditLog {

* id, user_id, action, object_type, object_id, details, created_at

- record()
  }

13. Notification {

* id, user_id, type, params_json, status, sent_at

- sendEmail(), schedule()
  }

14. Settings {

* key, value

- get(), set()
  }

Relations clefs :

* User 1..* Order
* User 1..* License
* Product 1..* License
* Course 1..* Lesson
* License 1..* Activation


MVP (priorité haute)

* Auth

  * UI: /login /register /forgot
  * API: POST /api/auth/login, POST /api/auth/register, POST /api/auth/forgot

* Catalogue produits

  * UI: /products, /product/:sku
  * API: GET /api/products, GET /api/products/:id

* Achat & Paiement

  * UI: checkout, récapitulatif commande
  * API: POST /api/orders, POST /api/payments/webhook (PSP)
  * Intégrations: Stripe, PayPal (ou PSP local)

* Génération & gestion licences

  * API: POST /api/licenses (créée après paiement), GET /api/licenses/:id, POST /api/licenses/:id/renew

* Téléchargement sécurisé

  * API: GET /api/downloads/:file_id?token=...
  * Génération token : POST /api/downloads/generate

* Dashboard utilisateur

  * UI: /dashboard — liste licences, statut, boutons renouveler/télécharger, accès formation
  * API: GET /api/users/:id/licenses, GET /api/users/:id/orders

* Formations (contenu restreint)

  * UI: /learning — listing courses, lecteur vidéo
  * API: GET /api/courses, GET /api/courses/:id/lessons

* Admin minimal

  * UI: /admin — products, orders, users, licences
  * API: CRUD endpoints pour Product, User, License, Order

* Notifications emails

  * Templates achat, licence, rappel expiration

Phase 2 (après MVP)

* Streaming vidéo sécurisé (HLS + signed URLs)
* Multi-seat & licence flottante
* Gestion versions des installateurs, rollback
* Invoices PDF automatiques (facturation)
* API publique pour validation de licence côté client (SDK léger)
* Portail reseller / affiliate
* Analytics avancé (usage produit, churn)
* SSO / OAuth corporate
* Mobile app companion (si besoin)

Endpoints recommandés pour intégration client/WinDev

* POST /api/license/validate {key, device_id} -> {valid, expiry, allowed}
* POST /api/license/heartbeat {key, device_id} -> usage telemetry (rate-limited)


Hypothèse équipe (minimum viable) :

* 1 Backend Laravel dev (Lead)
* 1 Frontend React dev
* 1 DevOps (peut être part-time)
* 1 Designer / UX (part-time)
* 1 QA / Testeur (peut être partagé)

Semaine 0 (prépa - 3 jours)

* Kickoff, architecture, définition API (OpenAPI), setup repo, environnements (dev/staging/prod), Docker.
  Livrables: repo initial, README, structure monorepo.

Sprint 1 (Semaine 1) — Auth + infra

* Backend : modèles User/Role, endpoints auth, migrations.
* Frontend : pages login/register, layout, auth flow.
* DevOps : CI pipeline basique, déploiement staging.
* QA : tests basiques.

Sprint 2 (Semaine 2) — Catalogue produits + modèle Product

* Backend : Product model, CRUD endpoints admin, stockage métadonnées fichiers.
* Frontend : catalogue & détail produit.
* Designer : pages produit & checkout wireframe.

Sprint 3 (Semaine 3) — Paiement & commandes

* Intégration PSP sandbox (Stripe recommended).
* Order model & logic.
* Webhook listener pour confirmer paiements.
* Frontend : checkout flow + confirmation.

Sprint 4 (Semaine 4) — Licence system & génération

* Backend : Licence model, génération post-paiement, endpoints validate/renew.
* Frontend : Dashboard initial affichant licences.
* QA : tests d’activation, edge cases.

Sprint 5 (Semaine 5) — Téléchargement sécurisé + Assets

* Implement signed download tokens, uploads (admin) vers S3, CDN config.
* Frontend : bouton download, liens temporaires.
* DevOps : config CDN, domaine staging.

Sprint 6 (Semaine 6) — Section formations

* Backend : Course/Lesson models, upload/stream URLs signées.
* Frontend : viewer video (simple), liste cours.
* QA : test d’accès conditionnel.

Sprint 7 (Semaine 7) — Admin panel & analytics basiques

* Backend : admin endpoints, audit logs, basic reports.
* Frontend : admin views (users/orders/licenses).
* Designer : UI polish.

Sprint 8 (Semaine 8) — Tests, sécurité, déploiement prod & buffer

* Tests unitaires/integration, correction bugs, sécurité (scan), runbook déploiement.
* Déploiement production, smoke testing, monitoring basique.
* Buffer pour retards.

Tâches journalières/assignations (exemples)

* Backend (Lead) : 50% API + 30% licence/payment logic + 20% bugfix.
* Frontend : pages + intégration API + responsive.
* DevOps : pipelines, SSL, backups, monitoring.
* Designer : composants UI, assets, branding.
* QA : scripts test, automatisation basique.

Risques & mitigations

* Problèmes PSP locaux -> prévoir PSP alternatif.
* Fichiers lourds -> tester chunked upload dès Sprint 5.
* Intégration licence côté WinDev (client) -> prévoir API simple de validation (POST /license/validate).
* Sécurité -> audit minimal avant prod, config CSP, rate-limit.

Critères de réussite MVP (fin semaine 8)

* Achat + paiement + génération licence + téléchargement sécurisé fonctionnels.
* Dashboard utilisateur & admin opérationnels.
* Déploiement prod et documentation pour support.



// Toutes les routes nécessaires pour le MVP Mastertrade

export const routes = {
    // Authentification
    login:        "/login",
    register:     "/register",
    forgot:       "/forgot",

    // Dashboard utilisateur
    dashboard:    "/dashboard",

    // Catalogue produits
    products:             "/products",
    productShow:          (id) => `/products/${id}`,

    // Achat & paiement
    checkout:             (productId) => `/products/${productId}/checkout`,
    orders:               "/orders",
    orderShow:            (id) => `/orders/${id}`,

    // Licences
    licenses:             "/licenses",
    licenseShow:          (id) => `/licenses/${id}`,
    licenseRenew:         (id) => `/licenses/${id}/renew`,
    licenseValidate:      "/api/license/validate",
    licenseHeartbeat:     "/api/license/heartbeat",

    // Téléchargement sécurisé
    downloadGenerate:     "/downloads/generate",

    // Formations
    courses:              "/courses",
    courseShow:           (id) => `/courses/${id}`,
    lessons:              (courseId) => `/courses/${courseId}/lessons`,
    lessonShow:           (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,

    // Admin panel
    admin:                "/admin",
    adminProducts:        "/admin/products",
    adminUsers:           "/admin/users",
    adminLicenses:        "/admin/licenses",
    adminOrders:          "/admin/orders",
    adminLogs:            "/admin/logs",

    // Notifications
    notifications:        "/notifications",

    // Support
    tickets:              "/support/tickets",
    ticketShow:           (id) => `/support/tickets/${id}`,

    // Pricing & contact
    pricing:              "/pricing",
    contact:              "/contact",
};


Sideabar

--User
Tableau de bord (Dashboard)
Catalogue des produits
Mes licences
Mes commandes
Téléchargements
Formations (e-learning)
Notifications
Support / Tickets
Paramètres du compte

--Pour l’admin :
Gestion des utilisateurs
Gestion des produits
Gestion des licences
Gestion des commandes
Logs & audit
Analytics


-------Gestion des models --------

1. User
id (bigint, PK)
name (string)
email (string, unique)
password (string)
phone (string, nullable)
country (string, nullable)
role_id (foreign key)
created_at (timestamp)
updated_at (timestamp)
last_login (timestamp, nullable)

2. Role
id (bigint, PK)
name (string, unique)
permissions (json, nullable)
created_at (timestamp)
updated_at (timestamp)

3. Product
id (bigint, PK)
name (string)
sku (string, unique)
version (string)
checksum (string)
size (integer)
changelog (text, nullable)
description (text)
category (string)
created_at (timestamp)
updated_at (timestamp)

4. License
id (bigint, PK)
key (string, unique)
product_id (foreign key)
user_id (foreign key, nullable)
status (enum: active/expired/revoked/trial)
type (enum: permanent/subscription/seat-based)
expiry_date (date, nullable)
max_activations (integer)
activations_count (integer)
created_at (timestamp)
renewed_at (timestamp, nullable)

5. Order
id (bigint, PK)
user_id (foreign key)
product_id (foreign key)
status (enum: pending/paid/failed/refunded)
amount (decimal)
payment_method (string)
payment_id (string, nullable)
created_at (timestamp)
updated_at (timestamp)


6. Download
id (bigint, PK)
user_id (foreign key)
product_id (foreign key)
license_id (foreign key, nullable)
ip_address (string)
file_version (string)
timestamp (timestamp)

7. Course
id (bigint, PK)
title (string)
description (text)
is_paid (boolean)
product_id (foreign key, nullable)
created_at (timestamp)
updated_at (timestamp)

8. Lesson
id (bigint, PK)
course_id (foreign key)
title (string)
content_url (string)
type (enum: video/pdf)
created_at (timestamp)
updated_at (timestamp)

9. Notification
id (bigint, PK)
user_id (foreign key)
type (string)
data (json)
read_at (timestamp, nullable)
created_at (timestamp)

10. Ticket (Support)
id (bigint, PK)
user_id (foreign key)
license_id (foreign key, nullable)
order_id (foreign key, nullable)
subject (string)
message (text)
status (enum: open/closed/pending)
created_at (timestamp)
updated_at (timestamp)

11. AuditLog
id (bigint, PK)
admin_id (foreign key)
action (string)
target_type (string)
target_id (bigint)
details (json, nullable)
created_at (timestamp)


----------------------------------------------------------------------

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

// Routes pour le profil utilisateur
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('profile/security', [ProfileController::class, 'security'])->name('profile.security');
    Route::put('profile/security', [ProfileController::class, 'updateSecurity'])->name('profile.update-security');
});

// Routes pour les paramètres
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('settings', [SettingsController::class, 'index'])->name('settings');
    Route::put('settings/general', [SettingsController::class, 'updateGeneral'])->name('settings.general');
    Route::put('settings/notifications', [SettingsController::class, 'updateNotifications'])->name('settings.notifications');
    Route::put('settings/billing', [SettingsController::class, 'updateBilling'])->name('settings.billing');
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

// Routes pour les pages statiques
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('about', function () {
        return Inertia::render('About');
    })->name('about');

    Route::get('contact', function () {
        return Inertia::render('Contact');
    })->name('contact');

    Route::get('privacy', function () {
        return Inertia::render('Privacy');
    })->name('privacy');

    Route::get('terms', function () {
        return Inertia::render('Terms');
    })->name('terms');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
