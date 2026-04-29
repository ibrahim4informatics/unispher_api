/*
  Warnings:

  - You are about to drop the column `leading_department_id` on the `TeacherProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `TeacherProfile` DROP FOREIGN KEY `TeacherProfile_leading_department_id_fkey`;

-- DropIndex
DROP INDEX `TeacherProfile_leading_department_id_key` ON `TeacherProfile`;

-- AlterTable
ALTER TABLE `TeacherProfile` DROP COLUMN `leading_department_id`;
