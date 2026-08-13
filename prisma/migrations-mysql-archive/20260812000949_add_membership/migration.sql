-- CreateTable
CREATE TABLE `memberships` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `planId` VARCHAR(32) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `renewsAt` DATETIME(3) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `paymentProvider` ENUM('STRIPE', 'FLUTTERWAVE', 'DPO_PAY') NOT NULL,
    `paymentStatus` ENUM('SUCCEEDED', 'FAILED', 'PENDING', 'REFUNDED') NOT NULL,
    `paymentAmount` DECIMAL(10, 2) NOT NULL,
    `paymentCurrency` VARCHAR(3) NOT NULL,
    `paymentCardBrand` VARCHAR(20) NULL,
    `paymentLast4` VARCHAR(4) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `memberships_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
