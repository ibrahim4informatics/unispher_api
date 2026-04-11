/*
  Warnings:

  - You are about to drop the `MessageAttachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MessageAttachment` DROP FOREIGN KEY `MessageAttachment_message_id_fkey`;

-- DropTable
DROP TABLE `MessageAttachment`;
