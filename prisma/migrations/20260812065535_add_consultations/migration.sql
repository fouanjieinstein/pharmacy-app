-- CreateTable
CREATE TABLE `consultations` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `doctorId` VARCHAR(64) NOT NULL,
    `slot` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `feeUsd` DECIMAL(10, 2) NOT NULL,
    `reasonForVisit` TEXT NULL,
    `bookedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cancelledAt` DATETIME(3) NULL,
    `paymentProvider` ENUM('STRIPE', 'FLUTTERWAVE', 'DPO_PAY') NOT NULL,
    `paymentStatus` ENUM('SUCCEEDED', 'FAILED', 'PENDING', 'REFUNDED') NOT NULL,
    `paymentAmount` DECIMAL(10, 2) NOT NULL,
    `paymentCurrency` VARCHAR(3) NOT NULL,
    `paymentCardBrand` VARCHAR(20) NULL,
    `paymentLast4` VARCHAR(4) NULL,

    INDEX `consultations_userId_idx`(`userId`),
    UNIQUE INDEX `consultations_doctorId_slot_key`(`doctorId`, `slot`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `consultations` ADD CONSTRAINT `consultations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
