# 📚 KPopick - Project Documentation

**KPopick** adalah platform e-commerce K-Pop modern yang dibangun dengan teknologi terkini, menyediakan fitur lengkap untuk pembelian produk K-Pop dengan sistem pembayaran terintegrasi, manajemen admin, dan user experience yang optimal.

---

## 📑 Daftar Isi

1. [Ringkasan Eksekutif](#ringkasan-eksekutif)
2. [Tech Stack](#tech-stack)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Database Schema](#database-schema)
5. [Backend API Documentation](#backend-api-documentation)
6. [Frontend Architecture](#frontend-architecture)
7. [Panduan Setup](#panduan-setup)
8. [Deployment](#deployment)
9. [Fitur Utama](#fitur-utama)
10. [Struktur Folder](#struktur-folder)
11. [Development Workflow](#development-workflow)
12. [Recent Changes & Improvements](#recent-changes--improvements)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Ringkasan Eksekutif

KPopick adalah aplikasi e-commerce yang dirancang khusus untuk K-Pop merchandise. Platform ini menggabungkan:

- **Frontend Modern**: Vue.js 3 dengan Vite, Tailwind CSS untuk UI yang responsif
- **Backend Robust**: NestJS dengan TypeScript, mengikuti best practices
- **Database Relational**: PostgreSQL dengan Prisma ORM untuk manajemen data yang aman
- **Payment Gateway**: Integrasi Xendit untuk pemrosesan pembayaran
- **Role-Based Access Control**: Admin dashboard dengan fitur manajemen lengkap
- **Storage Cloud**: MinIO S3 untuk penyimpanan gambar produk
- **Authentication**: JWT + Passport.js untuk keamanan yang solid

---

## 🛠 Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Vue.js | 3.5.24 | JavaScript Framework |
| Vite | 7.2.4 | Build tool & Dev server |
| TypeScript | ~5.9.3 | Type safety |
| Tailwind CSS | 3.4.0 | Styling & utility-first CSS |
| Pinia | 3.0.4 | State management |
| Vue Router | 4.6.4 | Client-side routing |
| Radix Vue | 1.9.17 | Unstyled, accessible components |
| Axios | 1.13.2 | HTTP client |
| Vee-Validate | 4.15.1 | Form validation |
| Yup | 1.7.1 | Schema validation |
| CLSX | 2.1.1 | CSS class management |

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| NestJS | 11.1.16 | Node.js framework |
| Node.js | 18+ | Runtime |
| TypeScript | ~5.9.3 | Type safety |
| PostgreSQL | 13+ | Database |
| Prisma | 6.19.2 | ORM |
| JWT | 11.0.2 | Authentication |
| Passport.js | 0.7.0 | Auth strategy |
| MinIO | 8.0.7 | S3-compatible storage |
| Xendit | - | Payment integration |
| Swagger | 11.2.5 | API documentation |
| Winston | 3.19.0 | Logging |

---

## 🏗 Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Vue.js 3 SPA (Vite)                                 │   │
│  │  - Landing Page                                      │   │
│  │  - Product Catalog & Search                          │   │
│  │  - Shopping Cart & Checkout                          │   │
│  │  - User Dashboard & Orders                           │   │
│  │  - Admin Panel (Dashboard, Products, Orders)         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
              HTTP/REST API
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                  API LAYER (NestJS)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Gateway & Middleware                            │   │
│  │  - CORS handling                                     │   │
│  │  - JWT Authentication                               │   │
│  │  - Request/Response Logging                          │   │
│  │  - Error Handling                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Modules                                             │   │
│  │  ├── Auth Module (JWT, Passport)                    │   │
│  │  ├── Products Module (CRUD, Search)                 │   │
│  │  ├── Categories Module (Hierarchy)                  │   │
│  │  ├── Orders Module (Management)                     │   │
│  │  ├── Payment Module (Xendit)                        │   │
│  │  └── Addresses Module (User addresses)              │   │
│  └──────────────────────────────────────────────────────┘   │
└────┬──────────────────┬──────────────────────┬───────────┬───┘
     │                  │                      │           │
     ▼                  ▼                      ▼           ▼
┌─────────────┐  ┌─────────────┐  ┌───────────────┐  ┌──────────┐
│ PostgreSQL  │  │   MinIO     │  │    Xendit     │  │ External │
│  Database   │  │  Storage    │  │    Payment    │  │   APIs   │
└─────────────┘  └─────────────┘  └───────────────┘  └──────────┘
```

### Deployment Architecture

```
┌────────────────────────────────┐
│    Vercel (Frontend)           │
│  - Auto-deploy dari Git        │
│  - CDN Global                  │
│  - HTTPS Certificate           │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│    Railway (Backend)           │
│  - Node.js runtime             │
│  - PostgreSQL managed          │
│  - Environment variables       │
│  - Auto-scaling                │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│    MinIO (Storage)             │
│  - S3-compatible API           │
│  - Product images              │
└────────────────────────────────┘
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
User (1)
  ├─ (1:N) -> Order
  ├─ (1:N) -> UserAddress
  └─ Fields: id, email, password, name, phone, address, role, photoUrl, createdAt, updatedAt

Category (Hierarchical)
  ├─ (1:N) -> Product
  ├─ (Self-referencing) -> Category (parentId)
  └─ Fields: id, name, slug, description, image, parentId, createdAt, updatedAt

Product
  ├─ (1:N) -> OrderItem
  ├─ (1:N) -> ProductImage
  ├─ (N:1) -> Category
  └─ Fields: id, name, slug, description, price, stock, image, imageUrl, rating, 
             categoryId, isPromoted, createdAt, updatedAt

ProductImage
  └─ (N:1) -> Product
  └─ Fields: id, productId, imageUrl, createdAt

Order
  ├─ (1:N) -> OrderItem
  ├─ (N:1) -> User
  └─ Fields: id, userId, totalPrice, status, createdAt, updatedAt, metadata,
             totalItemPrice, shippingFee, grandTotal, xenditInvoiceId, paymentUrl,
             recipientName, recipientPhone, shippingAddress, shippingDetail, courierNote,
             shippingLat, shippingLong

OrderItem
  ├─ (N:1) -> Order
  └─ (N:1) -> Product
  └─ Fields: id, orderId, productId, quantity, price, 
             @@unique([orderId, productId]), createdAt

Enums:
  - UserRole: USER, ADMIN
  - OrderStatus: WAITING_PAYMENT, PAID, PROCESSING, SHIPPED, COMPLETED, CANCELLED
```

### Table Details

#### 1. **User Table**
```sql
CREATE TABLE User (
  id             SERIAL PRIMARY KEY,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password       VARCHAR(255) NOT NULL,
  name           VARCHAR(255),
  phone          VARCHAR(20),
  address        TEXT,
  photoUrl       VARCHAR(500),
  role           UserRole DEFAULT 'USER',
  createdAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **Product Table**
```sql
CREATE TABLE Product (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  slug           VARCHAR(255) UNIQUE NOT NULL,
  description    TEXT,
  price          FLOAT NOT NULL,
  stock          INTEGER DEFAULT 0,
  image          VARCHAR(500),
  imageUrl       VARCHAR(500),
  rating         FLOAT DEFAULT 0,
  categoryId     INTEGER NOT NULL REFERENCES Category(id),
  isPromoted     BOOLEAN DEFAULT FALSE,
  createdAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **Order Table**
```sql
CREATE TABLE "Order" (
  id              SERIAL PRIMARY KEY,
  userId          INTEGER NOT NULL REFERENCES User(id),
  totalPrice      FLOAT DEFAULT 0,
  totalItemPrice  FLOAT DEFAULT 0,
  shippingFee     FLOAT DEFAULT 0,
  grandTotal      FLOAT DEFAULT 0,
  status          OrderStatus DEFAULT 'WAITING_PAYMENT',
  xenditInvoiceId VARCHAR(255) UNIQUE,
  paymentUrl      VARCHAR(500),
  recipientName   VARCHAR(255) DEFAULT '',
  recipientPhone  VARCHAR(20) DEFAULT '',
  shippingAddress TEXT DEFAULT '',
  shippingDetail  TEXT,
  courierNote     TEXT,
  shippingLat     FLOAT,
  shippingLong    FLOAT,
  metadata        TEXT,
  createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Backend API Documentation

### Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://kpopick-backend.railway.app`
- **API Docs**: `{BASE_URL}/api/docs`

### Authentication
Menggunakan JWT (JSON Web Tokens) dengan Passport.js. Token dikirim di header:
```
Authorization: Bearer {token}
```

### Module Routes & Endpoints

#### 🔐 **AUTH MODULE** (`/auth`)
**Path**: `/backend/src/modules/auth/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Daftar user baru | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| GET | `/auth/profile` | Dapatkan profil user | ✅ |
| PUT | `/auth/profile` | Update profil user | ✅ |

**Example Request/Response**:
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "phone": "081234567890"
  }'

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Files in Module**:
- `auth.controller.ts` - Route handlers
- `auth.service.ts` - Business logic
- `auth.module.ts` - Module configuration
- `dto/` - Data Transfer Objects (RegisterDto, LoginDto)
- Strategies: `jwt.strategy.ts`, `local.strategy.ts`

---

#### 📦 **PRODUCTS MODULE** (`/products`)
**Path**: `/backend/src/modules/products/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Dapatkan semua produk (dengan pagination) | ❌ |
| GET | `/products/search` | Search produk | ❌ |
| GET | `/products/promoted` | Dapatkan produk yang dipromosikan | ❌ |
| GET | `/products/:id` | Dapatkan detail produk | ❌ |
| POST | `/products` | Buat produk baru | ✅ ADMIN |
| PUT | `/products/:id` | Update produk | ✅ ADMIN |
| DELETE | `/products/:id` | Hapus produk | ✅ ADMIN |

**Example Request/Response**:
```bash
# Get all products
curl -X GET "http://localhost:3000/products?page=1&limit=10"

# Response
{
  "data": [
    {
      "id": 1,
      "name": "BTS Map of the Soul Poster",
      "slug": "bts-map-of-the-soul-poster",
      "price": 299000,
      "stock": 50,
      "rating": 4.5,
      "imageUrl": "https://minio.example.com/...",
      "category": {
        "id": 1,
        "name": "Posters"
      },
      "isPromoted": true,
      "createdAt": "2026-04-11T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10
}

# Get promoted products
curl -X GET "http://localhost:3000/products/promoted"

# Search products
curl -X GET "http://localhost:3000/products/search?q=BTS&category=posters"
```

**Files in Module**:
- `product.controller.ts` - Route handlers
- `product.service.ts` - Business logic
- `product.module.ts` - Module configuration
- `dto/` - CreateProductDto, UpdateProductDto

---

#### 📂 **CATEGORIES MODULE** (`/categories`)
**Path**: `/backend/src/modules/categories/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | Dapatkan semua kategori (hierarchy) | ❌ |
| GET | `/categories/:id` | Dapatkan detail kategori | ❌ |
| POST | `/categories` | Buat kategori baru | ✅ ADMIN |
| PUT | `/categories/:id` | Update kategori | ✅ ADMIN |
| DELETE | `/categories/:id` | Hapus kategori | ✅ ADMIN |

**Example Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Merchandise",
      "slug": "merchandise",
      "description": "K-Pop merchandise",
      "image": "...",
      "children": [
        {
          "id": 2,
          "name": "Posters",
          "slug": "posters"
        },
        {
          "id": 3,
          "name": "Albums",
          "slug": "albums"
        }
      ]
    }
  ]
}
```

---

#### 🛒 **ORDERS MODULE** (`/orders`)
**Path**: `/backend/src/modules/orders/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/orders` | Dapatkan orders user | ✅ USER |
| GET | `/orders/admin` | Dapatkan semua orders | ✅ ADMIN |
| GET | `/orders/:id` | Dapatkan detail order | ✅ |
| POST | `/orders` | Buat order baru | ✅ USER |
| PUT | `/orders/:id/status` | Update status order | ✅ ADMIN |
| DELETE | `/orders/:id` | Batalkan order | ✅ |

**Example Request/Response**:
```bash
# Create Order
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "productId": 1, "quantity": 2 }
    ],
    "recipientName": "John Doe",
    "recipientPhone": "081234567890",
    "shippingAddress": "Jl. Example No. 123"
  }'

# Response
{
  "id": 1,
  "userId": 1,
  "totalPrice": 598000,
  "totalItemPrice": 598000,
  "shippingFee": 0,
  "grandTotal": 598000,
  "status": "WAITING_PAYMENT",
  "xenditInvoiceId": "...",
  "paymentUrl": "https://invoice.xendit.co/...",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 299000
    }
  ]
}
```

**Status Workflow**:
```
WAITING_PAYMENT → PAID → PROCESSING → SHIPPED → COMPLETED
                   ↓        ↓           ↓
               CANCELLED CANCELLED  CANCELLED
```

---

#### 💳 **PAYMENT MODULE** (`/payment`)
**Path**: `/backend/src/modules/payment/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/payment/xendit/callback` | Xendit payment callback | ❌ |
| GET | `/payment/status/:invoiceId` | Cek status pembayaran | ✅ |

**Xendit Integration**:
- Integrasi WebhOok untuk notifikasi pembayaran
- Invoice dibuat otomatis saat order dibuat
- Redirect ke Xendit payment gateway
- Webhook callback mengupdate status order

---

#### 📍 **ADDRESSES MODULE** (`/addresses`)
**Path**: `/backend/src/modules/addresses/`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/addresses` | Dapatkan alamat user | ✅ |
| POST | `/addresses` | Tambah alamat baru | ✅ |
| PUT | `/addresses/:id` | Update alamat | ✅ |
| DELETE | `/addresses/:id` | Hapus alamat | ✅ |
| PUT | `/addresses/:id/default` | Set alamat default | ✅ |

---

### Error Handling

**Standard Error Response**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🎨 Frontend Architecture

### Folder Structure

```
frontend/
├── src/
│   ├── App.vue                 # Root component
│   ├── main.ts                 # Entry point
│   │
│   ├── core/                   # Core functionality
│   │   └── api.ts              # Axios instance & API client
│   │
│   ├── shared/                 # Shared resources
│   │   ├── stores/             # Pinia stores (global state)
│   │   │   ├── auth.store.ts
│   │   │   ├── cart.store.ts
│   │   │   ├── product.store.ts
│   │   │   ├── order.store.ts
│   │   │   └── checkout.store.ts
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   └── dateFormatter.ts
│   │   │
│   │   ├── config/             # Configuration files
│   │   │   ├── auth.config.ts
│   │   │   └── shippingAndTax.ts
│   │   │
│   │   └── components/         # Shared components
│   │
│   ├── modules/                # Feature modules
│   │   ├── landing/            # Landing page
│   │   │   ├── components/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── pages/
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── ProductsPage.vue
│   │   │   │   ├── OrdersPage.vue
│   │   │   │   └── AdminLoginView.vue
│   │   │   ├── components/
│   │   │   │   └── AdminTopbar.vue
│   │   │   └── types/
│   │   │
│   │   ├── checkout/           # Checkout flow
│   │   │   ├── components/
│   │   │   │   ├── CheckoutOrderSummary.vue
│   │   │   │   ├── CheckoutStepIndicator.vue
│   │   │   │   └── steps/
│   │   │   │       ├── ConsumerInfoStep.vue
│   │   │   │       ├── ShippingStep.vue
│   │   │   │       ├── PaymentMethodStep.vue
│   │   │   │       └── ReviewStep.vue
│   │   │   └── types/
│   │   │
│   │   └── [other modules]/
│   │
│   ├── layouts/                # Layout components
│   │   └── AdminLayouts.vue
│   │
│   ├── views/                  # Page views (routed)
│   │   ├── HomeView.vue
│   │   ├── ProductsView.vue
│   │   ├── CartView.vue
│   │   ├── CheckoutView.vue
│   │   ├── SearchView.vue
│   │   ├── CategoriesView.vue
│   │   ├── NotFoundView.vue
│   │   ├── LandingPageView.vue
│   │   └── admin/
│   │       ├── AdminLoginView.vue
│   │       ├── DashboardView.vue
│   │       ├── OrderListView.vue
│   │       └── [other admin views]/
│   │
│   ├── router/                 # Vue Router configuration
│   │   ├── index.ts
│   │   └── router.d.ts
│   │
│   ├── components/             # Reusable UI components
│   │   └── ui/
│   │       └── hover-card/
│   │
│   ├── assets/                 # Static assets
│   │   └── styles/
│   │       └── global.css
│   │
│   └── locales/                # i18n translations
│
└── public/                     # Public static files
    └── images/
```

### Core Components & Pages

#### **1. Landing Page Module** (`/modules/landing/`)
**Components**:
- `PopularArtistCarousel.vue` - Animated carousel with marquee effect
- `RecommendationSection.vue` - Featured & promoted products
- `HeroSection.vue` - Hero banner
- `SearchBar.vue` - Product search

**Features**:
- CSS keyframes animation untuk marquee scrolling
- Intersection Observer untuk lazy loading
- Product image zoom on hover dengan mousemove events
- Responsive design untuk all device sizes

---

#### **2. Admin Dashboard** (`/modules/admin/`)

**Pages**:
- `DashboardView.vue` - Overview & statistics
- `ProductsPage.vue` - Product CRUD
  - List dengan pagination
  - Add/Edit products
  - Mark as Flash Sale (isPromoted)
  - Image upload to MinIO
- `OrdersPage.vue` - Order management
  - List dengan filtering & pagination
  - Status update
  - Date formatting dengan `formatDateWithTime()` utility
- `AdminLoginView.vue` - Admin authentication

**Features**:
- Role-based access control (ADMIN only)
- Data filtering & searching
- Pagination untuk large datasets
- Real-time status updates
- Form validation

---

#### **3. Checkout Module** (`/modules/checkout/`)

**Multi-step Checkout Process**:
1. **Consumer Info Step** - Nama, email, phone
2. **Shipping Step** - Alamat pengiriman
3. **Payment Method Step** - Pilih metode pembayaran
4. **Review Step** - Review order sebelum bayar

**Order Summary**:
- Configurable shipping fee (dari `shippingAndTax.ts`)
- Configurable tax rate (dari `shippingAndTax.ts`)
- Subtotal, shipping, tax, total calculations
- Real-time calculation updates

**Configuration Files**:
- `shared/config/shippingAndTax.ts` - Centralized shipping & tax config
  - `SHIPPING_CONFIG.default: 0` - No shipping fee
  - `TAX_CONFIG.rate: 0` - No tax
  - Helper functions: `getShippingFee()`, `calculateTax()`, `calculateTotal()`

---

#### **4. Date Formatter Utility** (`/shared/utils/dateFormatter.ts`)

**Functions**:
- `formatDateTime(value, includeTime?)` - Main formatting function
- `formatDate(value)` - Date only (DD/MM/YYYY)
- `formatDateWithTime(value)` - Date with time (DD/MM/YYYY HH:mm:ss)
- `formatRelativeTime(value)` - Relative time ("2 hours ago")

**Features**:
- Handles: null, undefined, empty strings, invalid dates
- Returns `-` for invalid inputs
- Format: `DD/MM/YYYY HH:mm:ss`
- Full error handling & JSDoc documentation

**Usage Example**:
```typescript
import { formatDateWithTime } from '@/shared/utils/dateFormatter'

// In template
{{ formatDateWithTime(order.createdAt) }}
// Output: 11/04/2026 14:30:45
```

---

### State Management (Pinia)

**Core Stores**:

#### `auth.store.ts`
```typescript
state: {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  role: 'USER' | 'ADMIN'
}

actions: {
  login(email, password)
  register(email, password, name, phone)
  logout()
  refreshToken()
  setUser(user)
}
```

#### `cart.store.ts`
```typescript
state: {
  items: CartItem[]  // { id, productId, name, price, quantity, imageUrl }
  total: number
}

actions: {
  addItem(product)
  removeItem(productId)
  updateQuantity(productId, quantity)
  clear()
}

getters: {
  itemCount()
  total()
  subtotal()
}
```

#### `checkout.store.ts`
```typescript
state: {
  currentStep: 'consumer' | 'shipping' | 'payment'
  consumer: { firstName, lastName, email, phone }
  shipping: { address, city, province, postalCode, country }
  payment: { method, selectedPaymentMethod }
}

actions: {
  goToNextStep()
  goToPreviousStep()
  setConsumerInfo(data)
  setShippingAddress(data)
  setPaymentMethod(method)
}
```

---

### Routing Structure

**Public Routes**:
- `/` - Home / Landing page
- `/products` - Products catalog
- `/search` - Search results
- `/categories` - Categories
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/login` - User login
- `/register` - User registration
- `/404` - Not found page

**Protected Routes** (Require Authentication):
- `/dashboard` - User dashboard
- `/orders` - Order history
- `/account` - Account settings
- `/addresses` - Address management

**Admin Routes** (Require ADMIN Role):
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/categories` - Category management

---

## 🔧 Panduan Setup

### Prerequisites
```bash
# Check versions
node --version  # v18+
npm --version   # 9+

# Install Node.js from https://nodejs.org/
```

### Backend Setup

#### 1. **Clone Repository & Setup Environment**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

#### 2. **Configure Environment Variables** (`.env`)
```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kpopick"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRATION="24h"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"

# MinIO Storage
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="kpopick"
MINIO_PUBLIC_URL="http://localhost:9000"

# Xendit Payment
XENDIT_SECRET_KEY="xnd_development_xxxxx"
XENDIT_CALLBACK_TOKEN="your-callback-token"

# File Upload
MULTER_DEST="./uploads"

# CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

#### 3. **Database Setup**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

#### 4. **Start Backend**
```bash
# Development mode (watch for changes)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

**Endpoints Available**:
- API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api/docs`
- Health check: `http://localhost:3000/health`

---

### Frontend Setup

#### 1. **Install Dependencies**
```bash
cd frontend
npm install
```

#### 2. **Configure Environment Variables** (Create `.env.local`)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=KPopick
VITE_APP_VERSION=1.0.0
```

#### 3. **Start Development Server**
```bash
npm run dev

# Server started at http://localhost:5173
```

#### 4. **Build for Production**
```bash
npm run build

# Output in dist/
```

#### 5. **Preview Production Build**
```bash
npm run preview
```

---

### Docker Setup (Optional)

**Start with Docker Compose**:
```bash
# Start all services
docker-compose up -d

# Services:
# - PostgreSQL: localhost:5432
# - MinIO: localhost:9000
# - Backend: localhost:3000
# - Frontend: localhost:5173

# Stop services
docker-compose down
```

**Docker Files**:
- `backend/dockerfile` - Backend image
- `backend/docker-compose.yml` - All services composition

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### 1. **Connect Repository**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 2. **Environment Variables in Vercel**
```
VITE_API_URL=https://kpopick-backend.railway.app
```

#### 3. **Build Configuration**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Current Status**: Deployed at `https://kpopickshop.vercel.app`

---

### Backend Deployment (Railway)

#### 1. **Connect to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link
```

#### 2. **Environment Variables in Railway**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://kpopickshop.vercel.app
XENDIT_SECRET_KEY=xnd_production_xxxxx
XENDIT_CALLBACK_TOKEN=your-token
MINIO_ENDPOINT=your-minio-host
```

#### 3. **Deploy**
```bash
railway up
```

**Current Status**: Deployed on Railway
- API: `https://kpopick-backend.railway.app`
- PostgreSQL: Managed on Railway

---

### Database Backup & Migration

#### PostgreSQL Backup
```bash
# Backup database
pg_dump -U username -h localhost -d kpopick > backup.sql

# Restore database
psql -U username -h localhost -d kpopick < backup.sql
```

#### Prisma Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Deploy migration to production
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset
```

---

## ✨ Fitur Utama

### 🛍️ E-Commerce Core
- ✅ Product catalog dengan search & filtering
- ✅ Category hierarchy dengan sub-categories
- ✅ Shopping cart management
- ✅ Multi-step checkout process
- ✅ Order management & tracking

### 💳 Payment Integration
- ✅ Xendit payment gateway integration
- ✅ Multiple payment methods (Bank Transfer, E-Wallet, Credit Card, etc.)
- ✅ Invoice generation & payment status tracking
- ✅ Webhook callback handling

### 👥 User Management
- ✅ User registration & authentication
- ✅ JWT-based authentication
- ✅ Role-based access control (USER, ADMIN)
- ✅ User profile management
- ✅ Address management

### 📦 Admin Features
- ✅ Admin dashboard dengan statistics
- ✅ Product CRUD operations
- ✅ Product image upload ke MinIO
- ✅ Mark products as promoted/Flash Sale
- ✅ Order management & status updates
- ✅ Category management

### 🎨 Frontend Features
- ✅ Responsive design (Mobile-first)
- ✅ Dark mode ready
- ✅ Form validation (Vee-Validate + Yup)
- ✅ Date formatting utility
- ✅ Configurable shipping & tax
- ✅ Real-time shopping cart updates
- ✅ Image lazy loading & optimization

### 🔒 Security
- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Passport.js strategies
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (Prisma ORM)

### 📊 Logging & Monitoring
- ✅ Winston logger
- ✅ Daily rotating logs
- ✅ API request/response logging
- ✅ Error tracking

---

## 📁 Struktur Folder Lengkap

### Backend Structure
```
backend/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── local-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── services/
│   │   │   └── storage.service.ts
│   │   └── strategies/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   │
│   ├── interceptors/
│   │   └── image-url.interceptor.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       └── login.dto.ts
│   │   │
│   │   ├── products/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.module.ts
│   │   │   └── dto/
│   │   │       ├── create-product.dto.ts
│   │   │       └── update-product.dto.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   ├── category.module.ts
│   │   │   └── dto/
│   │   │
│   │   ├── orders/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── orders.module.ts
│   │   │   └── dto/
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   └── payment.module.ts
│   │   │
│   │   └── addresses/
│   │       ├── addresses.controller.ts
│   │       ├── addresses.service.ts
│   │       ├── addresses.module.ts
│   │       └── dto/
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── migration_lock.toml
│       ├── 20260202152207_init/
│       └── 20260315213700_extend_order_schema/
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
└── dockerfile
```

### Frontend Structure
```
frontend/
├── src/
│   ├── core/
│   │   └── api.ts
│   │
│   ├── shared/
│   │   ├── stores/
│   │   │   ├── auth.store.ts
│   │   │   ├── cart.store.ts
│   │   │   ├── product.store.ts
│   │   │   ├── order.store.ts
│   │   │   └── checkout.store.ts
│   │   │
│   │   ├── utils/
│   │   │   └── dateFormatter.ts
│   │   │
│   │   ├── config/
│   │   │   ├── auth.config.ts
│   │   │   └── shippingAndTax.ts
│   │   │
│   │   └── components/
│   │
│   ├── modules/
│   │   ├── landing/
│   │   │   ├── components/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── admin/
│   │   │   ├── pages/
│   │   │   │   ├── DashboardView.vue
│   │   │   │   ├── ProductsPage.vue
│   │   │   │   └── OrdersPage.vue
│   │   │   ├── components/
│   │   │   └── types/
│   │   │
│   │   └── checkout/
│   │       ├── components/
│   │       ├── types/
│   │       └── stores/
│   │
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── ProductsView.vue
│   │   ├── CartView.vue
│   │   ├── CheckoutView.vue
│   │   ├── SearchView.vue
│   │   └── admin/
│   │
│   ├── router/
│   │   ├── index.ts
│   │   └── router.d.ts
│   │
│   ├── assets/
│   │   └── styles/
│   │       └── global.css
│   │
│   ├── locales/
│   ├── App.vue
│   └── main.ts
│
└── public/
    └── images/
```

---

## 👨‍💻 Development Workflow

### 1. **Feature Development**

#### Backend (NestJS)
```bash
# 1. Create new module
nest generate module modules/newFeature

# 2. Create controller
nest generate controller modules/newFeature

# 3. Create service
nest generate service modules/newFeature

# 4. Create DTO
# Manually create newFeature.dto.ts in modules/newFeature/dto

# 5. Add to AppModule imports

# 6. Test
npm run test
npm run test:e2e
```

#### Frontend (Vue 3)
```bash
# 1. Create module folder in src/modules/

# 2. Create components
# src/modules/newFeature/components/

# 3. Create store (if needed)
# src/shared/stores/newFeature.store.ts

# 4. Create views
# src/views/NewFeatureView.vue

# 5. Add routes in router/index.ts

# 6. Test with dev server
npm run dev
```

### 2. **Version Control**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make commits
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

**Commit Convention**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no logic changes)
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/dependency updates

### 3. **Testing**

#### Backend Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

#### Frontend Tests
```bash
# Currently using manual testing
# Vitest can be added in future
```

### 4. **Code Quality**

```bash
# Backend
npm run lint          # Check linting issues
npm run format        # Auto-format code
npm run build         # Build for production

# Frontend
npm run build         # Build for production
npm run preview       # Preview production build
```

---

## 🔄 Recent Changes & Improvements

### Phase 1: Flash Sale Feature ✅
**Status**: Completed

**Changes**:
- Added `isPromoted` boolean field to Product model
- Created dedicated `/products/promoted` endpoint
- Updated frontend RecommendationSection to use promoted products
- Added "Mark as Flash Sale" checkbox in admin ProductsPage

**Files Modified**:
- `backend/prisma/schema.prisma` - Added isPromoted field
- `backend/src/modules/products/product.service.ts` - Promoted products endpoint
- `frontend/src/modules/landing/components/RecommendationSection.vue`
- `frontend/src/modules/admin/pages/ProductsPage.vue`

---

### Phase 2: Date Formatting Utility ✅
**Status**: Completed

**Problem**: 
- Order dates showing as "Invalid Date" in OrdersPage
- No centralized date formatting solution

**Solution**:
- Created `shared/utils/dateFormatter.ts` with comprehensive date formatting
- Functions: `formatDateTime()`, `formatDate()`, `formatDateWithTime()`, `formatRelativeTime()`
- Full error handling for null, undefined, invalid dates
- Format: `DD/MM/YYYY HH:mm:ss`

**Files Created**:
- `frontend/src/shared/utils/dateFormatter.ts`

**Files Modified**:
- `frontend/src/modules/admin/pages/OrdersPage.vue` - Using formatDateWithTime()

---

### Phase 3: Redis Removal ✅
**Status**: Completed

**Changes**:
- Removed unused Redis service from docker-compose.yml
- Removed ioredis and redis packages from backend package.json
- Cleaned up 207 total packages

**Reason**: Redis was not actively used in the application, only consuming resources

---

### Phase 4: Hardcoded Shipping & Tax Removal ✅
**Status**: Completed

**Problem**:
- Hardcoded shipping fee (Rp 10.000) in multiple components
- Hardcoded tax calculation (10%) scattered across checkout components
- No centralized configuration

**Solution**:
- Created `shared/config/shippingAndTax.ts` with centralized config
- Helper functions: `getShippingFee()`, `calculateTax()`, `calculateTotal()`
- Current values: Shipping = 0, Tax = 0% (actual prices displayed)
- Easy to modify without touching component code

**Files Created**:
- `frontend/src/shared/config/shippingAndTax.ts`

**Files Modified**:
- `frontend/src/modules/checkout/components/CheckoutOrderSummary.vue`
  - Shipping/Tax rows only show if > 0
  - Uses helper functions instead of hardcoded values
- `frontend/src/views/CheckoutView.vue`
  - orderSummary computed: uses `getShippingFee()`, `calculateTax()`
  - orderTotal computed: uses same helpers

---

### Phase 5: TAX_CONFIG Unused Import Removal ✅
**Status**: Completed

**Issue**: 
- Compiler warning: "TAX_CONFIG is declared but its value is never read"
- Unused import in CheckoutOrderSummary.vue

**Fix**:
- Removed unused import from line 59
- Only import necessary functions: `getShippingFee`, `calculateTax`

**Files Modified**:
- `frontend/src/modules/checkout/components/CheckoutOrderSummary.vue`

---

## 🐛 Troubleshooting

### Backend Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**:
```bash
# Check PostgreSQL is running
# Windows: Services > PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Or update DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@correct-host:5432/kpopick"

# Test connection
npx prisma db execute --stdin < test.sql
```

#### Prisma Migration Conflicts
```bash
# Reset database (DEVELOPMENT ONLY)
npx prisma migrate reset

# Or resolve conflicts manually
npx prisma migrate resolve --rolled-back migration_name
```

#### JWT Token Errors
```
Error: TokenExpiredError
```
**Solution**:
- Token might be expired, user needs to login again
- Check JWT_EXPIRATION value in .env
- Implement refresh token mechanism if needed

---

### Frontend Issues

#### Module Not Found Errors
```
error: Cannot find module '@/utils/dateFormatter'
```
**Solution**:
- Check file exists at correct path
- Check `@` alias configured in `vite.config.ts`
- Verify import path matches file location

#### State Management Issues
```
Store not updating after action
```
**Solution**:
```typescript
// Incorrect
state.user = newUser  // Direct mutation

// Correct
this.user = newUser   // Use setters
// or in store
state.user = newUser  // Inside mutations
```

#### API Connection Issues
```
Error: 401 Unauthorized
```
**Solution**:
- Check token in localStorage
- Token might be expired, user needs to login
- Check API_URL in .env correct
- Verify backend is running

---

### Deployment Issues

#### Vercel Build Fails
```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Type errors (run: npm run build locally)
# 2. Missing env variables (check .env.local)
# 3. API URL incorrect

# Fix & redeploy
git push origin main
```

#### Railway Deployment Fails
```bash
# Check logs
railway logs

# Common issues:
# 1. Database migration failed
# 2. Missing environment variables
# 3. Port not exposed correctly

# Fix
railway redeploy
```

---

## 📚 Additional Resources

### Documentation Links
- [Vue.js 3 Documentation](https://vuejs.org/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Xendit API Documentation](https://developers.xendit.co/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Related Guides
- [JWT Authentication Best Practices](https://tools.ietf.org/html/rfc7519)
- [REST API Design Guide](https://restfulapi.net/)
- [Git Workflow Guide](https://www.atlassian.com/git/tutorials)

---

## 📝 License & Support

**License**: UNLICENSED (Private Project)

**Support**: 
- For issues, create GitHub issue
- For questions, contact project maintainer
- For production support, escalate through project manager

---

## 📊 Project Statistics

- **Total Files**: ~150+
- **Total Lines of Code**: ~15,000+
- **Backend Modules**: 6 (Auth, Products, Categories, Orders, Payment, Addresses)
- **Frontend Modules**: 3+ (Landing, Admin, Checkout)
- **Database Tables**: 7 (User, Product, Category, Order, OrderItem, etc.)
- **API Endpoints**: 30+
- **Test Cases**: E2E tests for critical flows

---

**Documentation Last Updated**: April 11, 2026

**Document Version**: 2.0 (Full Rewrite with Recent Changes)

---

**Created by**: Development Team  
**Maintained by**: Project Maintainer  
**Status**: ✅ Active Development
