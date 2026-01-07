// types/models.ts

export type UUID = string;

// 1️⃣ User
export interface User {
    id: UUID;
    name: string;
    email: string;
    email_verified_at?: string | null; // ISO date
    password?: string;
    phone?: string | null;
    country?: string | null;
    role_id?: UUID;
    last_login?: string | null; // ISO date
    created_at?: string;
    updated_at?: string;
    role?: Role;
    licenses?: License[];
    orders?: Order[];
    downloads?: Download[];
    notifications?: Notification[];
    tickets?: Ticket[];
}

// 2️⃣ Role
export interface Role {
    id: UUID;
    name: string;
    permissions?: Record<string, unknown>[]; // array ou objet JSON
    created_at: string;
    updated_at: string;
    users?: User[];
}

// 3️⃣ Product
export interface Product {
    id: UUID;
    name: string;
    sku: string;
    version: string;
    checksum: string;
    size: number;
    changelog?: string | null;
    description: string;
    category: string;
    features?: string[] | null;
    price_cents?: number;
    requires_license?: boolean;
    is_active?: boolean;
    created_at: string;
    updated_at: string;
    licenses?: License[];
    orders?: Order[];
    downloads?: Download[];
    courses?: Course[];
}

// 4️⃣ License
export interface License {
    id: UUID;
    key: string;
    product_id: UUID;
    user_id?: UUID | null;
    status: 'active' | 'expired' | 'revoked' | 'trial';
    type: 'permanent' | 'subscription' | 'seat-based';
    expiry_date?: string | null;
    max_activations: number;
    activations_count: number;
    created_at: string;
    renewed_at?: string | null;
    product?: Product;
    user?: User;
    downloads?: Download[];
    tickets?: Ticket[];
}

// 5️⃣ Order
export interface Order {
    id: UUID;
    user_id: UUID;
    product_id: UUID;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    amount: number;
    payment_method: string;
    payment_id?: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    product?: Product;
    tickets?: Ticket[];
}

// 6️⃣ Download
export interface Download {
    id: UUID;
    user_id: UUID;
    product_id: UUID;
    license_id?: UUID | null;
    ip_address: string;
    file_version: string;
    timestamp: string;
    user?: User;
    product?: Product;
    license?: License;
}

// 7️⃣ Course
export interface Course {
    id: UUID;
    title: string;
    description: string;
    is_paid: boolean;
    product_id?: UUID | null;
    created_at: string;
    updated_at: string;
    product?: Product;
    lessons?: Lesson[];
}

// 8️⃣ Lesson
export interface Lesson {
    id: UUID;
    course_id: UUID;
    title: string;
    content_url: string;
    type: 'video' | 'pdf';
    created_at: string;
    updated_at: string;
    course?: Course;
}

// 9️⃣ Notification
export interface Notification {
    id: UUID;
    user_id: UUID;
    type: string;
    data: Record<string, unknown>;
    read_at?: string | null;
    created_at: string;
    user?: User;
}

// 🔟 Ticket
export interface Ticket {
    id: UUID;
    user_id: UUID;
    license_id?: UUID | null;
    order_id?: UUID | null;
    subject: string;
    message: string;
    status: 'open' | 'closed' | 'pending';
    created_at: string;
    updated_at: string;
    user?: User;
    license?: License;
    order?: Order;
}

// 11️⃣ AuditLog
export interface AuditLog {
    id: UUID;
    admin_id: UUID;
    action: string;
    target_type: string;
    target_id: UUID;
    details?: Record<string, unknown>;
    created_at: string;
    admin?: User;
}
