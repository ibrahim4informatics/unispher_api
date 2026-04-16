/*
  Warnings:

  - You are about to drop the `_CourseToStudentProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CourseToStudentProfile` DROP FOREIGN KEY `_CourseToStudentProfile_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CourseToStudentProfile` DROP FOREIGN KEY `_CourseToStudentProfile_B_fkey`;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `studentProfileId` INTEGER NULL;

-- DropTable
DROP TABLE `_CourseToStudentProfile`;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_studentProfileId_fkey` FOREIGN KEY (`studentProfileId`) REFERENCES `StudentProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
