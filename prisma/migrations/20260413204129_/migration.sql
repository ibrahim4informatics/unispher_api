/*
  Warnings:

  - Added the required column `faculty_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field_id` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Course` ADD COLUMN `faculty_id` INTEGER NOT NULL,
    ADD COLUMN `field_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
