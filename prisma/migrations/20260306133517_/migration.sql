/*
  Warnings:

  - Added the required column `level_id` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StudentProfile` ADD COLUMN `level_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `StudentProfile` ADD CONSTRAINT `StudentProfile_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `Level`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
