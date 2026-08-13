-- CreateTable
CREATE TABLE `lab_bookings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(20) NOT NULL,
    `testIds` JSON NOT NULL,
    `slot` DATETIME(3) NOT NULL,
    `collectionMode` ENUM('HOME_VISIT', 'COLLECTION_CENTRE') NOT NULL,
    `collectionAddress` VARCHAR(500) NULL,
    `status` ENUM('SCHEDULED', 'SAMPLE_COLLECTED', 'PROCESSING', 'REPORT_READY', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `subtotalUsd` DECIMAL(10, 2) NOT NULL,
    `collectionFeeUsd` DECIMAL(10, 2) NOT NULL,
    `totalUsd` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `bookedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cancelledAt` DATETIME(3) NULL,
    `paymentProvider` ENUM('STRIPE', 'FLUTTERWAVE', 'DPO_PAY') NOT NULL,
    `paymentStatus` ENUM('SUCCEEDED', 'FAILED', 'PENDING', 'REFUNDED') NOT NULL,
    `paymentAmount` DECIMAL(10, 2) NOT NULL,
    `paymentCurrency` VARCHAR(3) NOT NULL,
    `paymentCardBrand` VARCHAR(20) NULL,
    `paymentLast4` VARCHAR(4) NULL,

    UNIQUE INDEX `lab_bookings_reference_key`(`reference`),
    INDEX `lab_bookings_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lab_bookings` ADD CONSTRAINT `lab_bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
