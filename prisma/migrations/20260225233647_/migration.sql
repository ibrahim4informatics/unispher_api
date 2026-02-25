/*
  Warnings:

  - The values [MODERATOR] on the enum `AdminProfile_admin_type` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[user_id,code]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `AdminProfile` MODIFY `admin_type` ENUM('SUPER_ADMIN', 'UNIVERSITY_ADMIN') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Otp_user_id_code_key` ON `Otp`(`user_id`, `code`);
