# Setup Backend dengan Database Login dan Product

## Langkah-Langkah Setup

### 1. Install Dependencies
```bash
cd backend
npm install bcryptjs
npm install --save-dev @types/bcryptjs
npm install -D prisma
```

### 2. Setup Database PostgreSQL
Pastikan Anda sudah install PostgreSQL. Buat database baru:

```sql
CREATE DATABASE kpopick;
```

### 3. Configure Environment Variables
Copy `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env` file dan masukkan konfigurasi database Anda:
```
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/kpopick"
JWT_SECRET="your-secret-key-here"
```

### 4. Run Prisma Migration
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 5. Start Server
```bash
npm run start:dev
```

Server akan berjalan di http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (require JWT)

### Products
- `GET /api/products` - Get semua products (pagination)
- `GET /api/products/promoted` - Get products yang di-promote
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (require JWT)
- `PATCH /api/products/:id` - Update product (require JWT)
- `DELETE /api/products/:id` - Delete product (require JWT)

### Categories
- `GET /api/categories` - Get semua categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category (require JWT)
- `PATCH /api/categories/:id` - Update category (require JWT)
- `DELETE /api/categories/:id` - Delete category (require JWT)

## Database Schema

### User
- id (int, primary key)
- email (string, unique)
- password (string, hashed)
- name (string)
- phone (string, optional)
- address (string, optional)
- createdAt (timestamp)
- updatedAt (timestamp)

### Category
- id (int, primary key)
- name (string, unique)
- slug (string, unique)
- description (string, optional)
- image (string, optional)
- createdAt (timestamp)
- updatedAt (timestamp)

### Product
- id (int, primary key)
- name (string)
- slug (string, unique)
- description (string, optional)
- price (float)
- stock (int)
- image (string, optional)
- imageUrl (string, optional)
- rating (float)
- categoryId (int, foreign key)
- isPromoted (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

### Order
- id (int, primary key)
- userId (int, foreign key)
- totalPrice (float)
- status (string)
- createdAt (timestamp)
- updatedAt (timestamp)

### OrderItem
- id (int, primary key)
- orderId (int, foreign key)
- productId (int, foreign key)
- quantity (int)
- price (float)
- createdAt (timestamp)

## Testing dengan Postman/Insomnia

### 1. Register User
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "phone": "081234567890",
  "address": "Jalan Merdeka No 1"
}
```

### 2. Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Create Category
```
POST http://localhost:3000/api/categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "K-Pop Idols",
  "slug": "kpop-idols",
  "description": "K-Pop Idols Products",
  "image": "https://example.com/image.jpg"
}
```

### 4. Create Product
```
POST http://localhost:3000/api/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "BTS Album",
  "slug": "bts-album",
  "description": "BTS Album Description",
  "price": 100000,
  "stock": 50,
  "categoryId": 1,
  "imageUrl": "https://example.com/album.jpg",
  "isPromoted": true
}
```

### 5. Get All Products
```
GET http://localhost:3000/api/products?skip=0&take=10
```

### 6. Get Promoted Products
```
GET http://localhost:3000/api/products/promoted
```

## Catatan Penting

- Password di-hash menggunakan bcryptjs sebelum disimpan ke database
- JWT digunakan untuk authentication
- Semua endpoint POST/PATCH/DELETE untuk admin memerlukan JWT token
- Image URL bisa diisi dari URL eksternal atau disimpan di cloud storage seperti Minio/S3

## Langkah Berikutnya

1. Setup file upload untuk images (Minio/S3)
2. Add admin role/permission
3. Add shopping cart functionality
4. Add order management
5. Add payment gateway integration
