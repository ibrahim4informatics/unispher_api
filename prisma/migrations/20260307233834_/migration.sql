-- AlterTable
ALTER TABLE `CourseMaterial` MODIFY `type` ENUM('IMAGE', 'VIDEO', 'PDF', 'EXCEL', 'WORD', 'PPT', 'TXT', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `PostMedia` MODIFY `type` ENUM('IMAGE', 'VIDEO', 'PDF', 'EXCEL', 'WORD', 'PPT', 'TXT', 'OTHER') NOT NULL;
