-- Reverts the raw-card-storage additions from 20260812131042_create_form_submission
-- and 20260812175936_unified_payment_system. See ARCHITECTURE.md §4 and the
-- schema header comment: no raw card number, CVV/CVC, or PIN is ever stored.

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_consultationId_fkey`;
ALTER TABLE `payments` DROP FOREIGN KEY `payments_labBookingId_fkey`;
ALTER TABLE `payments` DROP FOREIGN KEY `payments_membershipId_fkey`;
ALTER TABLE `payments` DROP FOREIGN KEY `payments_userId_fkey`;

-- DropIndex
DROP INDEX `payments_consultationId_key` ON `payments`;
DROP INDEX `payments_labBookingId_key` ON `payments`;
DROP INDEX `payments_membershipId_key` ON `payments`;
DROP INDEX `payments_userId_idx` ON `payments`;
DROP INDEX `payments_orderId_idx` ON `payments`;
DROP INDEX `payments_consultationId_idx` ON `payments`;
DROP INDEX `payments_labBookingId_idx` ON `payments`;
DROP INDEX `payments_membershipId_idx` ON `payments`;

-- AlterTable: drop raw card + polymorphic columns, restore orderId as required
ALTER TABLE `payments`
  DROP COLUMN `cardNumber`,
  DROP COLUMN `consultationId`,
  DROP COLUMN `cvv`,
  DROP COLUMN `expiryMonth`,
  DROP COLUMN `expiryYear`,
  DROP COLUMN `labBookingId`,
  DROP COLUMN `membershipId`,
  DROP COLUMN `nameOnCard`,
  DROP COLUMN `type`,
  DROP COLUMN `userId`,
  MODIFY `orderId` VARCHAR(191) NOT NULL;

-- AlterTable: drop raw card columns from consultations
ALTER TABLE `consultations`
  DROP COLUMN `paymentCardNumber`,
  DROP COLUMN `paymentCvv`,
  DROP COLUMN `paymentExpiryMonth`,
  DROP COLUMN `paymentExpiryYear`,
  DROP COLUMN `paymentNameOnCard`;

-- DropTable
DROP TABLE `FormSubmission`;
