-- CreateTable
CREATE TABLE `prescriptions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `fileType` VARCHAR(100) NOT NULL,
    `fileSizeKb` INTEGER NOT NULL,
    `storageKey` VARCHAR(255) NOT NULL,
    `status` ENUM('PENDING_REVIEW', 'UNDER_PHARMACIST_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUIRED') NOT NULL DEFAULT 'PENDING_REVIEW',
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `prescriptions_userId_idx`(`userId`),
    INDEX `prescriptions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescription_reviews` (
    `id` VARCHAR(191) NOT NULL,
    `prescriptionId` VARCHAR(191) NOT NULL,
    `pharmacistId` VARCHAR(191) NULL,
    `decision` ENUM('PENDING_REVIEW', 'UNDER_PHARMACIST_REVIEW', 'APPROVED', 'REJECTED', 'INFO_REQUIRED') NOT NULL,
    `notes` TEXT NULL,
    `reviewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `prescription_reviews_prescriptionId_idx`(`prescriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `prescriptions` ADD CONSTRAINT `prescriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_reviews` ADD CONSTRAINT `prescription_reviews_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `prescriptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prescription_reviews` ADD CONSTRAINT `prescription_reviews_pharmacistId_fkey` FOREIGN KEY (`pharmacistId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
