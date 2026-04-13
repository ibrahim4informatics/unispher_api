/*
  Warnings:

  - You are about to drop the column `level_id` on the `Module` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Module` DROP FOREIGN KEY `Module_level_id_fkey`;

-- AlterTable
ALTER TABLE `Module` DROP COLUMN `level_id`;

-- CreateTable
CREATE TABLE `_LevelToModule` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LevelToModule_AB_unique`(`A`, `B`),
    INDEX `_LevelToModule_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Module_name_idx` ON `Module`(`name`);

-- AddForeignKey
ALTER TABLE `_LevelToModule` ADD CONSTRAINT `_LevelToModule_A_fkey` FOREIGN KEY (`A`) REFERENCES `Level`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LevelToModule` ADD CONSTRAINT `_LevelToModule_B_fkey` FOREIGN KEY (`B`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
