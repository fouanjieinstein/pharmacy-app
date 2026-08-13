-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'PHARMACIST', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ORDER_PLACED', 'PAYMENT_CONFIRMED', 'PRESCRIPTION_VERIFIED', 'PHARMACY_PROCESSING', 'PACKED', 'DISPATCHED', 'IN_TRANSIT', 'CUSTOMS', 'OUT_FOR_DELIVERY', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'FLUTTERWAVE', 'DPO_PAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCEEDED', 'FAILED', 'PENDING', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('PENDING_REVIEW', 'UNDER_PHARMACIST_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUIRED');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LabCollectionMode" AS ENUM ('HOME_VISIT', 'COLLECTION_CENTRE');

-- CreateEnum
CREATE TYPE "LabBookingStatus" AS ENUM ('SCHEDULED', 'SAMPLE_COLLECTED', 'PROCESSING', 'REPORT_READY', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(32),
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "emailVerifiedAt" TIMESTAMP(3),
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_codes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" VARCHAR(255),
    "ipAddress" VARCHAR(64),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(32) NOT NULL,
    "email" VARCHAR(190) NOT NULL,
    "addressLine1" VARCHAR(190) NOT NULL,
    "addressLine2" VARCHAR(190),
    "city" VARCHAR(90) NOT NULL,
    "stateProvince" VARCHAR(90) NOT NULL,
    "postalCode" VARCHAR(24) NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" VARCHAR(90) NOT NULL,
    "entityType" VARCHAR(60),
    "entityId" VARCHAR(90),
    "metadata" JSONB,
    "ipAddress" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" VARCHAR(20) NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'ORDER_PLACED',
    "destinationCountry" VARCHAR(2) NOT NULL,
    "shippingMethodId" VARCHAR(32) NOT NULL,
    "prescriptionId" VARCHAR(90),
    "shipFullName" VARCHAR(120) NOT NULL,
    "shipPhone" VARCHAR(32) NOT NULL,
    "shipEmail" VARCHAR(190) NOT NULL,
    "shipAddressLine1" VARCHAR(190) NOT NULL,
    "shipAddressLine2" VARCHAR(190),
    "shipCity" VARCHAR(90) NOT NULL,
    "shipStateProvince" VARCHAR(90) NOT NULL,
    "shipPostalCode" VARCHAR(24) NOT NULL,
    "shipCountryCode" VARCHAR(2) NOT NULL,
    "subtotalUsd" DECIMAL(10,2) NOT NULL,
    "shippingUsd" DECIMAL(10,2) NOT NULL,
    "taxUsd" DECIMAL(10,2) NOT NULL,
    "totalUsd" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" VARCHAR(64) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPriceUsd" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "order_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "processorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "raw_card_number" TEXT,
    "raw_card_holder" TEXT,
    "raw_expiry" TEXT,
    "raw_cvv" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" VARCHAR(32) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewsAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "paymentProvider" "PaymentProvider" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "paymentAmount" DECIMAL(10,2) NOT NULL,
    "paymentCurrency" VARCHAR(3) NOT NULL,
    "paymentCardBrand" VARCHAR(20),
    "paymentLast4" VARCHAR(4),
    "raw_card_number" TEXT,
    "raw_card_holder" TEXT,
    "raw_expiry" TEXT,
    "raw_cvv" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" VARCHAR(64) NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(100) NOT NULL,
    "fileSizeKb" INTEGER NOT NULL,
    "storageKey" VARCHAR(255) NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_reviews" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "pharmacistId" TEXT,
    "decision" "PrescriptionStatus" NOT NULL,
    "notes" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescription_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "doctorId" VARCHAR(64) NOT NULL,
    "slot" TIMESTAMP(3) NOT NULL,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "feeUsd" DECIMAL(10,2) NOT NULL,
    "reasonForVisit" TEXT,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),
    "paymentProvider" "PaymentProvider" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "paymentAmount" DECIMAL(10,2) NOT NULL,
    "paymentCurrency" VARCHAR(3) NOT NULL,
    "paymentCardBrand" VARCHAR(20),
    "paymentLast4" VARCHAR(4),
    "raw_card_number" TEXT,
    "raw_card_holder" TEXT,
    "raw_expiry" TEXT,
    "raw_cvv" TEXT,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reference" VARCHAR(20) NOT NULL,
    "testIds" JSONB NOT NULL,
    "slot" TIMESTAMP(3) NOT NULL,
    "collectionMode" "LabCollectionMode" NOT NULL,
    "collectionAddress" VARCHAR(500),
    "status" "LabBookingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "subtotalUsd" DECIMAL(10,2) NOT NULL,
    "collectionFeeUsd" DECIMAL(10,2) NOT NULL,
    "totalUsd" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),
    "paymentProvider" "PaymentProvider" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "paymentAmount" DECIMAL(10,2) NOT NULL,
    "paymentCurrency" VARCHAR(3) NOT NULL,
    "paymentCardBrand" VARCHAR(20),
    "paymentLast4" VARCHAR(4),
    "raw_card_number" TEXT,
    "raw_card_holder" TEXT,
    "raw_expiry" TEXT,
    "raw_cvv" TEXT,

    CONSTRAINT "lab_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "email_verification_codes_userId_idx" ON "email_verification_codes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_userId_key" ON "memberships"("userId");

-- CreateIndex
CREATE INDEX "wishlist_items_userId_idx" ON "wishlist_items"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId");

-- CreateIndex
CREATE INDEX "prescriptions_userId_idx" ON "prescriptions"("userId");

-- CreateIndex
CREATE INDEX "prescriptions_status_idx" ON "prescriptions"("status");

-- CreateIndex
CREATE INDEX "prescription_reviews_prescriptionId_idx" ON "prescription_reviews"("prescriptionId");

-- CreateIndex
CREATE INDEX "consultations_userId_idx" ON "consultations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "consultations_doctorId_slot_key" ON "consultations"("doctorId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "lab_bookings_reference_key" ON "lab_bookings"("reference");

-- CreateIndex
CREATE INDEX "lab_bookings_userId_idx" ON "lab_bookings"("userId");

-- AddForeignKey
ALTER TABLE "email_verification_codes" ADD CONSTRAINT "email_verification_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_reviews" ADD CONSTRAINT "prescription_reviews_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_reviews" ADD CONSTRAINT "prescription_reviews_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_bookings" ADD CONSTRAINT "lab_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
