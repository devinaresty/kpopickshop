# Struktur Backend Project - NestJS Clean Architecture

---

---

## 🚀 QUICK START (Copy-Paste Langsung)

```powershell
# 1. Install CLI Global
npm i -g @nestjs/cli

# 2. Create Project
nest new kpop-shop-be --package-manager npm
cd kpop-shop-be

# 3. Install semua packages sekaligus
npm install @nestjs/config class-validator class-transformer dotenv @prisma/client prisma redis minio @nestjs/passport @nestjs/jwt passport passport-local passport-jwt @nestjs/swagger swagger-ui-express winston winston-daily-rotate-file ioredis @nestjs/cache-manager axios uuid joi; npm install -D @types/passport-local @types/passport-jwt @types/uuid prisma @nestjs/cli @nestjs/schematics @nestjs/testing jest @types/jest ts-jest supertest @types/supertest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier

# 4. Setup Prisma
npx prisma init

# Selesai! Lanjut ke STEP 3 dan seterusnya...
```

---

```
backend/
├── src/
│   ├── config/                          # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── minio.config.ts
│   │   └── env.validation.ts
│   │
│   ├── common/                          # Common utilities
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── exceptions/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   └── utils/
│   │
│   ├── infrastructure/                  # External services
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── prisma.service.ts
│   │   ├── cache/
│   │   │   └── redis.service.ts
│   │   ├── storage/
│   │   │   └── minio.service.ts
│   │   └── logger/
│   │       └── logger.service.ts
│   │
│   ├── modules/                         # Feature modules (Sisanya diisi user)
│   │   ├── users/
│   │   │   ├── domain/
│   │   │   │   └── user.entity.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistence/
│   │   │   │   │   └── user.repository.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-user.dto.ts
│   │   │   │       └── update-user.dto.ts
│   │   │   ├── application/
│   │   │   │   ├── services/
│   │   │   │   │   └── user.service.ts
│   │   │   │   └── use-cases/
│   │   │   └── presentation/
│   │   │       └── user.controller.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── domain/
│   │   │   │   └── auth.entity.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       └── register.dto.ts
│   │   │   ├── application/
│   │   │   │   └── services/
│   │   │   │       └── auth.service.ts
│   │   │   └── presentation/
│   │   │       └── auth.controller.ts
│   │   │
│   │   └── health/
│   │       ├── domain/
│   │       ├── application/
│   │       │   └── health.service.ts
│   │       └── presentation/
│   │           └── health.controller.ts
│   │
│   ├── app.module.ts
│   ├── main.ts
│   └── .env.example
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
│
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env
├── .env.example
├── .env.production
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── README.md
```

## 🔑 Penjelasan Layer (Clean Architecture)

### 1. **Domain Layer** (`domain/`)
- Entitas bisnis murni
- Business logic yang independen dari framework

### 2. **Application Layer** (`application/`)
- Use cases dan services
- Orchestration logic
- Business rule implementation

### 3. **Infrastructure Layer** (`infrastructure/`)
- Database access (Prisma)
- External services (Redis, Minio)
- Repository implementation
- DTO definitions

### 4. **Presentation Layer** (`presentation/`)
- Controllers
- API endpoints
- Request/Response handling

## 📦 Dependencies yang akan diinstall:
- ✅ @nestjs/core, @nestjs/common
- ✅ @nestjs/config (env management)
- ✅ @nestjs/swagger (API documentation)
- ✅ @nestjs/passport & @nestjs/jwt (authentication)
- ✅ prisma & @prisma/client (database)
- ✅ redis (caching)
- ✅ minio (object storage)
- ✅ class-validator & class-transformer (validation)
- ✅ dotenv (environment variables)
- ✅ winston (logging)

## 🐳 Docker Services:
- PostgreSQL (Database)
- Redis (Cache)
- Minio (Object Storage)
- NestJS App (Backend)

---

# 🚀 PETUNJUK SETUP STEP-BY-STEP

## **STEP 1: Create NestJS Project**

### ✅ OPSI A: Menggunakan npx (Recommended - Tidak perlu install global)

```bash
# Buka terminal di folder "d:\project ujikom (kpopick)"
cd "d:\project ujikom (kpopick)"

# Generate project NestJS dengan npx (modern & clean)
npx @nestjs/cli@latest new backend --package-manager npm

# Masuk ke folder backend
cd backend
```

**Keuntungan Opsi A:**
- ✅ Tidak perlu install CLI global (lebih clean)
- ✅ Selalu menggunakan versi terbaru
- ✅ Tidak mempengaruhi package global
- ✅ Recommended untuk production

---

### ✅ OPSI B: Install CLI Global (Seperti di Gemini)

```bash
# Buka terminal di folder "d:\project ujikom (kpopick)"
cd "d:\project ujikom (kpopick)"

# Install NestJS CLI secara global
npm i -g @nestjs/cli

# Generate project dengan perintah nest
nest new kpop-shop-be --package-manager npm

# Masuk ke folder backend
cd kpop-shop-be
```

**Keuntungan Opsi B:**
- ✅ CLI tersedia di mana saja (`nest` command)
- ✅ Lebih praktis untuk development rutin
- ✅ Command lebih pendek (`nest new`)
- ✅ Good untuk multiple projects

---

### 📊 Perbandingan

| Aspek | Opsi A (npx) | Opsi B (Global) |
|-------|--------------|-----------------|
| Install Global | ❌ Tidak | ✅ Ya |
| Command | `npx @nestjs/cli@latest new` | `nest new` |
| Versi | Selalu Latest | Sesuai yang di-install |
| Rekomendasi | ✅ PRODUCTION | Development |
| Disk Space | Minimal | +50MB |

---

### 🎯 **REKOMENDASI AKHIR:**

Gunakan **OPSI B (Global)** karena:
1. Lebih mudah digunakan untuk development
2. Command lebih pendek dan cepat
3. Sesuai dengan yang di Gemini (consistency)
4. Praktis jika akan buat multiple projects

**Jadi ikuti OPSI B dari atas!**

---

## **PERBANDINGAN GEMINI vs REKOMENDASI SAYA**

### Langkah di Gemini:
```bash
npm i -g @nestjs/cli
nest new kpop-shop-be
npm install @nestjs/config class-validator class-transformer
```

### ✅ Penjelasan:

| Langkah | Gemini | Status | Penjelasan |
|---------|--------|--------|-----------|
| `npm i -g @nestjs/cli` | ✅ Benar | ✅ Correct | Install CLI global - recommended |
| `nest new kpop-shop-be` | ✅ Benar | ✅ Correct | Create project dengan nama kpop-shop-be |
| `npm install @nestjs/config...` | ⚠️ Kurang | ❌ Incomplete | Hanya 3 packages, perlu lebih banyak |

### 🔧 Yang Perlu Ditambah (Dari Gemini):

```bash
# Gemini hanya install:
npm install @nestjs/config class-validator class-transformer

# SEHARUSNYA tambah juga:
npm install \
  dotenv \
  @prisma/client \
  prisma \
  redis \
  ioredis \
  @nestjs/cache-manager \
  minio \
  @nestjs/passport \
  @nestjs/jwt \
  passport \
  passport-local \
  passport-jwt \
  @nestjs/swagger \
  swagger-ui-express \
  winston \
  winston-daily-rotate-file \
  axios \
  uuid \
  joi

# Dev dependencies:
npm install -D \
  @types/passport-local \
  @types/passport-jwt \
  @types/uuid \
  jest \
  @types/jest \
  ts-jest \
  supertest \
  @types/supertest \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint \
  prettier
```

---

### 🎯 KESIMPULAN:

✅ **Gemini command BENAR, tapi TIDAK LENGKAP**
- Hanya setup basic NestJS
- Perlu menambah packages sesuai requirements (Redis, Prisma, Minio, Swagger, JWT, etc)

✅ **Gunakan langkah Gemini KEMUDIAN tambah packages lengkap:**

```bash
# STEP 1 - Gemini (BENAR)
npm i -g @nestjs/cli
nest new kpop-shop-be --package-manager npm
cd kpop-shop-be

# STEP 2 - Initial install
npm install

# STEP 3 - Tambah packages (LENGKAP)
npm install @nestjs/config class-validator class-transformer dotenv @prisma/client prisma redis ioredis @nestjs/cache-manager minio @nestjs/passport @nestjs/jwt passport passport-local passport-jwt @nestjs/swagger swagger-ui-express winston winston-daily-rotate-file axios uuid joi

npm install -D @types/passport-local @types/passport-jwt @types/uuid jest @types/jest ts-jest supertest @types/supertest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier
```

**INI ADALAH STEP 1 + 2 + 3 YANG SUDAH SAYA UPDATE!**

---

## **STEP 2: Install Dependencies**

### 2.1 Install Base Dependencies Terlebih Dahulu

```bash
# Navigate ke folder project (misal kpop-shop-be dari OPSI B)
cd kpop-shop-be

# Install base yang sudah ada di package.json
npm install
```

### 2.2 Install Additional Packages (SEPERTI DI GEMINI + TAMBAHAN)

**Cara terbaik: Copy-paste semua dalam satu command**

```bash
npm install @nestjs/config class-validator class-transformer dotenv @prisma/client prisma redis minio @nestjs/passport @nestjs/jwt passport passport-local passport-jwt @nestjs/swagger swagger-ui-express winston winston-daily-rotate-file ioredis @nestjs/cache-manager axios uuid joi
```

### 2.3 Install Dev Dependencies

```bash
npm install -D @types/passport-local @types/passport-jwt @types/uuid prisma @nestjs/cli @nestjs/schematics @nestjs/testing jest @types/jest ts-jest supertest @types/supertest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier
```

### ✅ Atau Langsung - Copy Command Lengkap Windows PowerShell

```powershell
npm install @nestjs/config class-validator class-transformer dotenv @prisma/client prisma redis minio @nestjs/passport @nestjs/jwt passport passport-local passport-jwt @nestjs/swagger swagger-ui-express winston winston-daily-rotate-file ioredis @nestjs/cache-manager axios uuid joi; npm install -D @types/passport-local @types/passport-jwt @types/uuid prisma @nestjs/cli @nestjs/schematics @nestjs/testing jest @types/jest ts-jest supertest @types/supertest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier
```

---

### 📝 **Penjelasan Packages:**

| Package | Fungsi | Type |
|---------|--------|------|
| `@nestjs/config` | Environment variables management | Prod |
| `class-validator` | Validasi DTO | Prod |
| `class-transformer` | Transform DTO ke object | Prod |
| `@prisma/client` | ORM untuk database | Prod |
| `prisma` | Prisma CLI untuk migrations | Dev |
| `redis` | Redis driver | Prod |
| `ioredis` | Redis client advanced | Prod |
| `@nestjs/cache-manager` | Cache module NestJS | Prod |
| `minio` | Object storage client | Prod |
| `@nestjs/passport` | Authentication middleware | Prod |
| `@nestjs/jwt` | JWT token generation | Prod |
| `passport-jwt` | JWT strategy | Prod |
| `@nestjs/swagger` | API documentation | Prod |
| `swagger-ui-express` | Swagger UI | Prod |
| `winston` | Logging advanced | Prod |
| `axios` | HTTP client | Prod |
| `uuid` | Generate unique ID | Prod |
| `joi` | Schema validation | Prod |
| `@types/*` | TypeScript types | Dev |
| `jest` | Testing framework | Dev |
| `prettier` & `eslint` | Code formatting | Dev |

---

### ✅ **Verifikasi Installation Berhasil**

```bash
# Check apakah semua packages ter-install
npm list

# Check specific package
npm list @nestjs/config
npm list prisma

# Check untuk error
npm audit
```

---

### 🎯 **SUMMARY STEP 2:**

1. ✅ `npm install` - base dependencies
2. ✅ `npm install [packages]` - production packages
3. ✅ `npm install -D [packages]` - dev packages
4. ✅ Verify dengan `npm list`
  @typescript-eslint/parser \
  eslint \
  jest \
  prettier \
  prisma \
  supertest \
  ts-jest \
  ts-loader \
  ts-node \
  tsconfig-paths \
  typescript
```

### **2B. Atau install per kategori (Alternative)**

```bash
# Step 1: Core NestJS
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs

# Step 2: Configuration
npm install @nestjs/config dotenv

# Step 3: Database & ORM
npm install @prisma/client
npm install -D prisma

# Step 4: Cache
npm install redis

# Step 5: Storage
npm install minio

# Step 6: Authentication
npm install @nestjs/passport @nestjs/jwt passport passport-local passport-jwt

# Step 7: API Documentation
npm install @nestjs/swagger swagger-ui-express

# Step 8: Validation
npm install class-validator class-transformer

# Step 9: Logging
npm install winston winston-daily-rotate-file

# Step 10: Utilities
npm install axios

# Step 11: Dev Tools & Types
npm install -D typescript @types/node @types/express @types/jest ts-node ts-loader
npm install -D @nestjs/cli @nestjs/schematics @typescript-eslint/eslint-plugin
npm install -D jest @types/jest ts-jest supertest @types/supertest
npm install -D eslint prettier tsconfig-paths
```

### **2C. Verify Installation**

```bash
# Check installed packages
npm list

# Verify NestJS CLI
npx nest --version

# Check TypeScript
npx tsc --version
```

### **2D. Pastikan package.json Scripts**

Buka `backend/package.json` dan pastikan ada scripts ini:

```json
"scripts": {
  "build": "nest build",
  "start": "node dist/main",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
```

**Ini sudah auto-generate saat `npx @nestjs/cli new`, tapi verifikasi saja!**

---

## **STEP 3: Setup Prisma**

```bash
# Initialize Prisma
npx prisma init

# Ini akan membuat:
# - prisma/schema.prisma
# - .env file

# Edit .env file dengan database URL:
# DATABASE_URL="postgresql://user:password@localhost:5432/kpopick"
```

---

## **STEP 4: Buat Folder Structure**

```
backend/src/
├── config/
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── minio.config.ts
│   └── env.validation.ts
├── common/
│   ├── decorators/
│   ├── dto/
│   ├── exceptions/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   └── utils/
├── infrastructure/
│   ├── database/
│   │   └── prisma.service.ts
│   ├── cache/
│   │   └── redis.service.ts
│   ├── storage/
│   │   └── minio.service.ts
│   └── logger/
│       └── logger.service.ts
├── modules/
│   ├── users/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── application/
│   │   └── presentation/
│   ├── auth/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── application/
│   │   └── presentation/
│   └── health/
│       ├── domain/
│       ├── application/
│       └── presentation/
├── app.module.ts
├── main.ts
└── .env.example
```

---

## **STEP 5: Setup Docker**

### File: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: kpopick_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: kpopick
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - kpopick_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: kpopick_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - kpopick_network
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Minio (Object Storage)
  minio:
    image: minio/minio:latest
    container_name: kpopick_minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/minio_data
    networks:
      - kpopick_network
    command: server /minio_data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  # NestJS Backend (uncomment setelah setup selesai)
  # backend:
  #   build:
  #     context: .
  #     dockerfile: docker/Dockerfile
  #   container_name: kpopick_backend
  #   environment:
  #     DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/kpopick
  #     REDIS_URL: redis://redis:6379
  #     MINIO_ENDPOINT: minio:9000
  #     MINIO_ACCESS_KEY: minioadmin
  #     MINIO_SECRET_KEY: minioadmin123
  #   ports:
  #     - "3000:3000"
  #   depends_on:
  #     postgres:
  #       condition: service_healthy
  #     redis:
  #       condition: service_healthy
  #     minio:
  #       condition: service_healthy
  #   networks:
  #     - kpopick_network
  #   volumes:
  #     - ./src:/app/src

volumes:
  postgres_data:
  redis_data:
  minio_data:

networks:
  kpopick_network:
    driver: bridge
```

### File: `docker/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build

EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
```

### File: `docker/.dockerignore`

```
node_modules
npm-debug.log
dist
.git
.gitignore
.env
.env.local
README.md
.DS_Store
```

---

## **STEP 6: Setup Environment Variables**

### File: `.env`

```env
# App Configuration
NODE_ENV=development
PORT=3000
APP_NAME=KPopick Backend

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/kpopick"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=kpopick

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Minio
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_USE_SSL=false
MINIO_REGION=us-east-1

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=3600

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs
```

### File: `.env.example`

```env
# App Configuration
NODE_ENV=development
PORT=3000
APP_NAME=KPopick Backend

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/kpopick"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=kpopick

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Minio
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_USE_SSL=false
MINIO_REGION=us-east-1

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=3600

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs
```

---

## **STEP 7: Setup DBeaver**

1. **Download DBeaver** dari [dbeaver.io](https://dbeaver.io/download/)
2. **Buat Connection Baru:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `kpopick`
   - Username: `postgres`
   - Password: `postgres123`
3. **Test Connection** sebelum menyimpan

---

## **STEP 8: Akses UI Services**

Setelah `docker-compose up`:

- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Minio Console**: http://localhost:9001
  - Username: `minioadmin`
  - Password: `minioadmin123`
- **Swagger/API Docs**: http://localhost:3000/api/docs (setelah setup)

---

## **STEP 9: Generate Prisma Schema & Migrations**

```bash
# Design schema di prisma/schema.prisma

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## **STEP 10: Run Docker Services**

```bash
# Start semua services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## **STEP 11: Run NestJS Application (Development)**

```bash
# Development mode dengan hot reload
npm run start:dev

# Production build
npm run build

# Production mode
npm start
```

---

## **STEP 12: Cek Swagger Documentation**

1. Buka browser: `http://localhost:3000/api/docs`
2. Test endpoint dari UI Swagger
3. Lihat request/response contoh

---

## **✅ Checklist Completion**

- [ ] NestJS project created
- [ ] Dependencies installed
- [ ] Folder structure created
- [ ] Docker Compose setup
- [ ] Environment variables configured
- [ ] DBeaver connected
- [ ] Docker services running
- [ ] Swagger accessible
- [ ] Prisma schema created
- [ ] Database migrations done
- [ ] Application running on port 3000

---

## **📝 NOTES:**

1. **Jangan lupa** ubah `JWT_SECRET` di production
2. **Database password** bisa diganti di docker-compose.yml
3. **Minio** bisa diakses di `http://localhost:9001`
4. **Semua services** berjalan di network `kpopick_network`
5. **Hot reload** hanya untuk development, bukan production

---

## **🔧 Troubleshooting**

| Masalah | Solusi |
|---------|--------|
| Port 5432 sudah terpakai | `docker-compose up -d --remove-orphans` |
| Redis tidak konek | Check `REDIS_HOST` di .env |
| Minio tidak bisa akses | Pastikan port 9000 & 9001 available |
| Prisma sync gagal | `npx prisma db push --force-reset` (hati-hati!) |
| Node modules error | `npm install` ulang atau `npm cache clean --force` |
