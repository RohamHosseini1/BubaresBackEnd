/*
  Warnings:

  - You are about to drop the column `userId` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Attachment` DROP FOREIGN KEY `Attachment_blogPostThumbnailId_fkey`;

-- DropForeignKey
ALTER TABLE `BlogPost` DROP FOREIGN KEY `BlogPost_userId_fkey`;

-- AlterTable
ALTER TABLE `BlogPost` DROP COLUMN `userId`,
    ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Attachment`;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
