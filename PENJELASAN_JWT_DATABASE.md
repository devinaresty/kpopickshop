# 🔐 Penjelasan JWT Secret & DATABASE_URL

## 1️⃣ JWT SECRET - Penjelasan Lengkap

### ❓ Pertanyaan Anda: "Apakah bisa menggunakan pw bebas dengan yang saya mau?"

**✅ JAWABAN: BISA, TAPI HARUS MENGIKUTI ATURAN**

### 📋 Persyaratan JWT Secret:

| Aspek | Persyaratan | Contoh ❌ | Contoh ✅ |
|-------|------------|----------|----------|
| **Panjang** | Minimal 32 karakter | `secret` | `xK9@mP#2qL$vN8!rS%tU^yW&aB*cD(eF)gH-jI_kL+mN=oP` |
| **Kombinasi** | Huruf + Angka + Simbol | `password123` | `K7mP#9qL$vN2!rS%tU&yW^aB*cD(eF)g` |
| **Keamanan** | Jangan yang mudah ditebak | `MyApp123` | `h9K2@pQ$wL8!vN3&rS%tU^yW*aB(cD)e` |
| **Konsistensi** | Sama untuk setiap environment | Berbeda di dev & prod | Sama untuk development |

### 🔧 Cara Generate JWT Secret yang Aman:

**Opsi 1: Menggunakan Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output contoh:**
```
a7f3e9c2b8d1f4a6c9e2b5f8d1c4a7e9c2b5f8d1c4a7e9c2b5f8d1c4a7e9
```

**Opsi 2: Menggunakan OpenSSL**
```bash
openssl rand -base64 32
```

**Output contoh:**
```
8r5t9K2x/Lp4Q1B8vN3Y+W6Z=
```

**Opsi 3: Menggunakan Online Tools (Hanya untuk Development)**
- https://www.random.org/ (generate string)
- https://www.uuidgenerator.net/ (generate UUID)

---

## 2️⃣ DATABASE_URL - Penjelasan Lengkap

### ❓ Pertanyaan Anda: "Untuk database url itu masukin pw postgre saya kan?"

**✅ JAWABAN: YA, BENAR! PASSWORD POSTGRESQL HARUS DIMASUKKAN**

### 📋 Format DATABASE_URL:

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

### 🔍 Breakdown Sesuai Config Anda:

```yaml
# Docker Compose Config:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: sukses7812
POSTGRES_DB: kpk_db
PORT: 5432
HOST: localhost (saat development) atau postgres (saat docker)
```

**Maka DATABASE_URL menjadi:**
```env
DATABASE_URL="postgresql://postgres:sukses7812@localhost:5432/kpk_db"
```

### ✨ Penjelasan Setiap Parameter:

| Parameter | Nilai Anda | Penjelasan |
|-----------|-----------|-----------|
| `postgresql://` | - | Protocol/driver PostgreSQL |
| `postgres` | Username | User database (di docker-compose: POSTGRES_USER) |
| `sukses7812` | Password | Password database (di docker-compose: POSTGRES_PASSWORD) |
| `localhost` | Host | Lokasi database (local development) |
| `5432` | Port | Port default PostgreSQL |
| `kpk_db` | Database | Nama database (di docker-compose: POSTGRES_DB) |

### 🚀 Perbedaan Local vs Docker:

**Saat Development (Local):**
```env
DATABASE_URL="postgresql://postgres:sukses7812@localhost:5432/kpk_db"
```

**Saat Docker Compose (Container):**
```env
DATABASE_URL="postgresql://postgres:sukses7812@postgres:5432/kpk_db"
# Catatan: "localhost" diganti "postgres" (service name di docker-compose)
```

---

## 3️⃣ Perbandingan: Apa yang SALAH vs BENAR

### ❌ SALAH (File .env Anda Sebelumnya):

```env
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI..."
```

**Masalah:**
- Menggunakan **Prisma Postgres Cloud** (hosted di cloud), bukan local PostgreSQL
- Tidak sesuai dengan docker-compose.yml Anda
- Prisma akan mencoba connect ke server cloud, bukan database lokal

### ✅ BENAR (File .env Sekarang):

```env
DATABASE_URL="postgresql://postgres:sukses7812@localhost:5432/kpk_db"
```

**Kelebihan:**
- Sesuai dengan docker-compose.yml
- Connect ke PostgreSQL lokal
- Format standar PostgreSQL connection string
- Cocok untuk development dan production

---

## 4️⃣ Sinkronisasi Config Files

### 📝 docker-compose.yml (Anda):
```yaml
postgres:
  environment:
    POSTGRES_USER: postgres          # ← Username
    POSTGRES_PASSWORD: sukses7812    # ← Password
    POSTGRES_DB: kpk_db              # ← Database Name
  ports:
    - "5432:5432"                    # ← Port
```

### 📝 .env (Harus Sesuai):
```env
DATABASE_URL="postgresql://postgres:sukses7812@localhost:5432/kpk_db"
#                        ^        ^              ^        ^   ^
#                     Username Password        Host    Port Database
```

**Rule Penting:**
- Username di DATABASE_URL = `POSTGRES_USER` di docker-compose
- Password di DATABASE_URL = `POSTGRES_PASSWORD` di docker-compose
- Database di DATABASE_URL = `POSTGRES_DB` di docker-compose
- Host = `localhost` (development) atau `postgres` (docker)
- Port = sama dengan docker-compose

---

## 5️⃣ Test Connection

### 🧪 Setelah Docker Running:

**Test 1: Menggunakan psql**
```bash
psql "postgresql://postgres:sukses7812@localhost:5432/kpk_db"
```

**Test 2: Menggunakan Prisma**
```bash
npx prisma db push
# atau
npx prisma migrate dev --name init
```

**Test 3: Di DBeaver**
1. Right Click → New Database Connection
2. Pilih PostgreSQL
3. Masukkan credentials:
   - Host: `localhost`
   - Port: `5432`
   - Database: `kpk_db`
   - Username: `postgres`
   - Password: `sukses7812`
4. Test Connection

---

## 6️⃣ Summary Checklist

### ✅ Untuk .env File Anda:

- [x] JWT_SECRET: String aman 32+ karakter
  ```env
  JWT_SECRET="xK9@mP#2qL$vN8!rS%tU^yW&aB*cD(eF)gH-jI_kL+mN=oP"
  ```

- [x] DATABASE_URL: Sesuai docker-compose.yml
  ```env
  DATABASE_URL="postgresql://postgres:sukses7812@localhost:5432/kpk_db"
  ```

- [x] REDIS_HOST & PORT: Sesuai docker-compose
  ```env
  REDIS_HOST="localhost"
  REDIS_PORT=6379
  ```

- [x] MINIO_ENDPOINT: Sesuai docker-compose
  ```env
  MINIO_ENDPOINT="localhost:9000"
  MINIO_ACCESS_KEY="miniokpk"
  MINIO_SECRET_KEY="miniokpk120"
  ```

---

## 7️⃣ Troubleshooting

| Masalah | Solusi |
|--------|--------|
| **Connection Refused** | Pastikan Docker running: `docker-compose ps` |
| **Auth Failed** | Check PASSWORD di DATABASE_URL sesuai docker-compose |
| **Database Not Found** | Check DB NAME di DATABASE_URL sesuai POSTGRES_DB |
| **JWT Error** | Pastikan JWT_SECRET di .env sesuai di NestJS config |
| **Prisma Sync Error** | Run: `npx prisma db push --force-reset` |

---

## 📚 Reference:

- PostgreSQL Connection String: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
- NestJS Config: https://docs.nestjs.com/techniques/configuration
- JWT Best Practices: https://tools.ietf.org/html/rfc7519
