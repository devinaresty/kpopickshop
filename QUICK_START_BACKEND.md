# 🚀 QUICK START GUIDE - Backend Setup

## ⚡ Langkah Cepat (5 Menit)

Jalankan commands ini satu per satu di terminal (di folder `backend`):

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Database (Docker)
```bash
docker-compose up -d
```

Tunggu sampai services siap (sekitar 30 detik)

### 3️⃣ Setup Prisma
```bash
npx prisma generate
npx prisma migrate deploy
```

### 4️⃣ Seed Database (Optional - Recommended)
```bash
npm run prisma:seed
```

Ini akan membuat:
- Sample users (admin@kpopick.com / admin123)
- Sample categories (BTS, BLACKPINK, TWICE, dll)
- Sample products

### 5️⃣ Start Server
```bash
npm run start:dev
```

✅ Server berjalan di http://localhost:3000

---

## 📝 Testing Login

Buka Postman/Insomnia atau gunakan cURL:

### Test Login (Admin)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kpopick.com",
    "password": "admin123"
  }'
```

### Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@kpopick.com",
    "name": "Admin KPopick",
    ...
  }
}
```

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Get Promoted Products
```bash
curl http://localhost:3000/api/products/promoted
```

---

## 🔧 Useful Commands

```bash
# View database di browser (Prisma Studio)
npx prisma studio

# Check migration status
npx prisma migrate status

# Reset database (hapus semua data)
npm run prisma:reset

# Build untuk production
npm run build

# Stop Docker services
docker-compose down

# Lihat Docker logs
docker logs kpk_pg      # PostgreSQL
docker logs kpk_redis   # Redis
docker logs kpoppick_minio  # MinIO
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication (register, login)
│   │   ├── products/      # Product management
│   │   └── categories/    # Category management
│   ├── common/
│   │   ├── guards/        # JWT, Local auth guards
│   │   ├── strategies/    # Passport strategies
│   │   └── decorators/    # @CurrentUser decorator
│   ├── app.module.ts      # Main module
│   └── main.ts           # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Sample data
│   └── migrations/       # Database migrations
├── .env                  # Environment variables
└── docker-compose.yml    # Docker services
```

---

## 💾 Database Schema

### User (Login)
- id, email (unique), password (hashed), name, phone, address
- Relations: orders

### Category
- id, name (unique), slug (unique), description, image
- Relations: products

### Product
- id, name, slug (unique), description, price, stock
- imageUrl, rating, categoryId, isPromoted
- Relations: category, orderItems

### Order
- id, userId, totalPrice, status (pending/completed/cancelled)
- Relations: user, items

### OrderItem
- id, orderId, productId, quantity, price

---

## ⚠️ Common Issues & Fixes

### ❌ "Cannot connect to database"
```bash
# Check docker is running
docker ps

# If not running:
docker-compose up -d

# Check logs:
docker logs kpk_pg
```

### ❌ "Port 3000 already in use"
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### ❌ "JWT_SECRET undefined"
```bash
# Check .env file exists:
cat .env

# Make sure it has JWT_SECRET
```

### ❌ "Prisma migration error"
```bash
npx prisma generate
npx prisma migrate deploy
```

---

## 🎯 Next Steps

Setelah backend berjalan:

1. **Frontend Integration**
   - Update API base URL di frontend (`http://localhost:3000`)
   - Test login flow

2. **File Upload** (MinIO/S3)
   - Setup file upload endpoint
   - Store product images

3. **Shopping Cart**
   - Add to cart functionality
   - Order management

4. **Payment Gateway**
   - Integrate Midtrans/Stripe
   - Payment verification

---

## 📚 Documentation

- **Detailed Guide:** [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)
- **API Documentation:** See endpoints below

---

## 🌐 API Quick Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/categories` | Get all categories | ❌ |
| POST | `/api/categories` | Create category | ✅ |
| GET | `/api/products` | Get all products | ❌ |
| GET | `/api/products/promoted` | Get promoted products | ❌ |
| POST | `/api/products` | Create product | ✅ |
| PATCH | `/api/products/:id` | Update product | ✅ |
| DELETE | `/api/products/:id` | Delete product | ✅ |

✅ = Requires JWT Token
❌ = Public endpoint

---

Siap? Mari kita jalankan! 🎵🚀
