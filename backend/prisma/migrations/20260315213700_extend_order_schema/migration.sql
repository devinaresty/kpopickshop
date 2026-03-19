-- AlterTable: Add missing columns to Order
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "totalItemPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "xenditInvoiceId" TEXT,
ADD COLUMN IF NOT EXISTS "paymentUrl" TEXT,
ADD COLUMN IF NOT EXISTS "recipientName" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "recipientPhone" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "shippingAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "shippingDetail" TEXT,
ADD COLUMN IF NOT EXISTS "courierNote" TEXT,
ADD COLUMN IF NOT EXISTS "shippingLat" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "shippingLong" DOUBLE PRECISION;

-- Rename status enum values if needed (update from 'pending' to 'WAITING_PAYMENT')
UPDATE "Order" SET "status" = 'WAITING_PAYMENT' WHERE "status" = 'pending';

-- CreateIndex: xenditInvoiceId unique index
CREATE UNIQUE INDEX IF NOT EXISTS "Order_xenditInvoiceId_key" ON "Order"("xenditInvoiceId");

-- AlterTable: Add missing columns to User
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';

-- AlterTable: Add missing columns to Product  
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "image" TEXT;

-- CreateTable: UserAddress
CREATE TABLE IF NOT EXISTS "UserAddress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "detail" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ProductImage
CREATE TABLE IF NOT EXISTS "ProductImage" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
