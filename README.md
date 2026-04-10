# 🎵 KPopick - K-Pop E-Commerce Platform

KPopick adalah monorepo e-commerce K-Pop yang terdiri dari frontend Vue.js 3 dan backend NestJS dengan sistem pembayaran terintegrasi Xendit, role-based access control, dan admin dashboard.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Vue.js 3, Vite, Tailwind CSS, Axios, Pinia |
| **Backend** | NestJS v6.19.2, Node.js, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | JWT + Passport.js, RBAC |
| **Payment** | Xendit |
| **Storage** | Minio S3 |

## Struktur Repo

```
kpopick/
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
```

## Prasyarat

- Node.js v18+
- npm/yarn
- PostgreSQL 13+
- Git

## Setup Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Salin file environment:

```bash
cp .env.example .env
```

Konfigurasi database pada file `.env`:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://user:password@localhost:5432/kpopick"

JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="24h"

MULTER_DEST="./uploads"

FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"
```

Generate Prisma Client dan jalankan migrasi database:

```bash
npx prisma generate
npx prisma migrate deploy
```

Jalankan backend:

```bash
npm run start:dev
```

Backend akan tersedia di **http://localhost:3000**.

## Konfigurasi Tambahan

### Payment Gateway (Xendit)

Di file `.env`, tambahkan:

```env
XENDIT_SECRET_KEY="xnd_development_xxxxx"
XENDIT_CALLBACK_TOKEN="your_callback_verification_token"
```

## Setup Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Salin file environment:

```bash
cp .env.example .env
```

Konfigurasi pada file `.env` (opsional, default sudah ke localhost:3000):

```env
VITE_API_URL=http://localhost:3000
```

Jalankan frontend:

```bash
npm run dev
```

Frontend akan tersedia di **http://localhost:5173**.

## Akun Seed

| Role | Email | Password |
|------|-------|----------|
| User | carmen@gmail.com | carmen123 |
| Admin | admin@gmail.com | admin123 |

## Endpoint API Tersedia

### Public
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/auth/register` | - | Registrasi user baru |
| POST | `/auth/login` | - | Login & generate JWT |
| GET | `/products` | - | Daftar semua produk |

### Authenticated User
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/profile` | Bearer | Data user yang login |
| GET | `/cart` | Bearer | Cart items |
| POST | `/orders` | Bearer | Buat order |
| GET | `/orders` | Bearer | Order history |
| POST | `/payment/create` | Bearer | Buat invoice Xendit |

### Admin
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/admin/products` | Admin | Daftar produk |
| POST | `/admin/products` | Admin | Tambah produk |
| PUT | `/admin/products/:id` | Admin | Update produk |
| DELETE | `/admin/products/:id` | Admin | Hapus produk |
| GET | `/admin/orders` | Admin | Daftar semua order |
| PUT | `/admin/orders/:id/status` | Admin | Update status order |

Header untuk auth:
```
Authorization: Bearer <token>
Accept: application/json
```

## Flow Lokal Singkat

1. Jalankan backend di http://localhost:3000
2. Jalankan frontend di http://localhost:5173
3. Login dengan akun user atau admin
4. User bisa browse produk, add to cart, dan checkout
5. Admin bisa buka admin panel dari menu profil

## Perintah yang Sering Dipakai

### Backend
```bash
npm run start:dev        # Start dengan watch mode
npm run build           # Build untuk production
npm run lint            # Run ESLint
npx prisma studio      # Buka GUI database
npx prisma migrate dev  # Create & apply migration
```

### Frontend
```bash
npm run dev             # Start dev server
npm run build           # Build untuk production
npm run preview         # Preview production build
npm run lint            # Run linting
```

##  Kontak & Links

- **Repository**: https://github.com/devinaresty/kpopickshop
- **Issues & Feedback**: Open issue di repository
- **License**: MIT

<<<<<<< HEAD
=======
### Admin Account
- **Email**: admin@gmail.com
- **Password**: admin123
>>>>>>> e1cd1075d38dee86358f4356eb8ac5fbf2429df7
