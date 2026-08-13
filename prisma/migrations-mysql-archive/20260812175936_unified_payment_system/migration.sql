/*
  Warnings:

  - A unique constraint covering the columns `[consultationId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[labBookingId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[membershipId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `consultations` ADD COLUMN `paymentCardNumber` VARCHAR(32) NULL,
    ADD COLUMN `paymentCvv` VARCHAR(4) NULL,
    ADD COLUMN `paymentExpiryMonth` INTEGER NULL,
    ADD COLUMN `paymentExpiryYear` INTEGER NULL,
    ADD COLUMN `paymentNameOnCard` VARCHAR(120) NULL;

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `cardNumber` VARCHAR(32) NULL,
    ADD COLUMN `consultationId` VARCHAR(191) NULL,
    ADD COLUMN `cvv` VARCHAR(4) NULL,
    ADD COLUMN `expiryMonth` INTEGER NULL,
    ADD COLUMN `expiryYear` INTEGER NULL,
    ADD COLUMN `labBookingId` VARCHAR(191) NULL,
    ADD COLUMN `membershipId` VARCHAR(191) NULL,
    ADD COLUMN `nameOnCard` VARCHAR(120) NULL,
    ADD COLUMN `type` ENUM('ORDER', 'CONSULTATION', 'LAB_BOOKING', 'MEMBERSHIP') NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL,
    MODIFY `orderId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `payments_userId_idx` ON `payments`(`userId`);

-- CreateIndex
CREATE INDEX `payments_orderId_idx` ON `payments`(`orderId`);

-- CreateIndex
CREATE INDEX `payments_consultationId_idx` ON `payments`(`consultationId`);

-- CreateIndex
CREATE INDEX `payments_labBookingId_idx` ON `payments`(`labBookingId`);

-- CreateIndex
CREATE INDEX `payments_membershipId_idx` ON `payments`(`membershipId`);

-- CreateIndex
CREATE UNIQUE INDEX `payments_consultationId_key` ON `payments`(`consultationId`);

-- CreateIndex
CREATE UNIQUE INDEX `payments_labBookingId_key` ON `payments`(`labBookingId`);

-- CreateIndex
CREATE UNIQUE INDEX `payments_membershipId_key` ON `payments`(`membershipId`);

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_consultationId_fkey` FOREIGN KEY (`consultationId`) REFERENCES `consultations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_labBookingId_fkey` FOREIGN KEY (`labBookingId`) REFERENCES `lab_bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
