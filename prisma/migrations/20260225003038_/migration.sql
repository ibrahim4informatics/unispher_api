-- AlterTable
ALTER TABLE `Session` ADD COLUMN `is_expired` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `expires_at` DATETIME(3) NULL;
