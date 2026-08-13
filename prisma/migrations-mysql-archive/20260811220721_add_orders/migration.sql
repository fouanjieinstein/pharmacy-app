-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(20) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('ORDER_PLACED', 'PAYMENT_CONFIRMED', 'PRESCRIPTION_VERIFIED', 'PHARMACY_PROCESSING', 'PACKED', 'DISPATCHED', 'IN_TRANSIT', 'CUSTOMS', 'OUT_FOR_DELIVERY', 'DELIVERED') NOT NULL DEFAULT 'ORDER_PLACED',
    `destinationCountry` VARCHAR(2) NOT NULL,
    `shippingMethodId` VARCHAR(32) NOT NULL,
    `prescriptionId` VARCHAR(90) NULL,
    `shipFullName` VARCHAR(120) NOT NULL,
    `shipPhone` VARCHAR(32) NOT NULL,
    `shipEmail` VARCHAR(190) NOT NULL,
    `shipAddressLine1` VARCHAR(190) NOT NULL,
    `shipAddressLine2` VARCHAR(190) NULL,
    `shipCity` VARCHAR(90) NOT NULL,
    `shipStateProvince` VARCHAR(90) NOT NULL,
    `shipPostalCode` VARCHAR(24) NOT NULL,
    `shipCountryCode` VARCHAR(2) NOT NULL,
    `subtotalUsd` DECIMAL(10, 2) NOT NULL,
    `shippingUsd` DECIMAL(10, 2) NOT NULL,
    `taxUsd` DECIMAL(10, 2) NOT NULL,
    `totalUsd` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `placedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
    INDEX `orders_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(64) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPriceUsd` DECIMAL(10, 2) NOT NULL,

    INDEX `order_items_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `provider` ENUM('STRIPE', 'FLUTTERWAVE', 'DPO_PAY') NOT NULL,
    `status` ENUM('SUCCEEDED', 'FAILED', 'PENDING', 'REFUNDED') NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `cardBrand` VARCHAR(20) NULL,
    `last4` VARCHAR(4) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payments_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
