/*
  Warnings:

  - Added the required column `entity_id` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `entity_id` INTEGER NOT NULL,
    ADD COLUMN `type` ENUM('PUBLISHED_POST', 'COMMENT_POST', 'LIKE_POST', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED', 'COURSE_ENROLLEMENT', 'COURSE_PUBLISHED', 'SYSTEM') NOT NULL;
