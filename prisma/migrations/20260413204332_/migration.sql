-- AlterTable
ALTER TABLE `Field` ADD COLUMN `moduleId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_FieldToModule` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FieldToModule_AB_unique`(`A`, `B`),
    INDEX `_FieldToModule_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FieldToModule` ADD CONSTRAINT `_FieldToModule_A_fkey` FOREIGN KEY (`A`) REFERENCES `Field`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FieldToModule` ADD CONSTRAINT `_FieldToModule_B_fkey` FOREIGN KEY (`B`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
