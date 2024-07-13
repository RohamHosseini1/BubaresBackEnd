/*
  Warnings:

  - A unique constraint covering the columns `[blogPostThumbnailId]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Attachment` ADD COLUMN `blogPostThumbnailId` INTEGER NULL,
    ADD COLUMN `retaledBlogPostId` INTEGER NULL;

-- AlterTable
ALTER TABLE `BlogPost` ADD COLUMN `ctaBtnHref` VARCHAR(191) NULL,
    ADD COLUMN `ctaBtnText` VARCHAR(191) NULL,
    ADD COLUMN `ctaText` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `jobTitle` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `BlogCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `BlogCategory_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BlogCategoryToBlogPost` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BlogCategoryToBlogPost_AB_unique`(`A`, `B`),
    INDEX `_BlogCategoryToBlogPost_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Attachment_blogPostThumbnailId_key` ON `Attachment`(`blogPostThumbnailId`);

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_blogPostThumbnailId_fkey` FOREIGN KEY (`blogPostThumbnailId`) REFERENCES `BlogPost`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogCategoryToBlogPost` ADD CONSTRAINT `_BlogCategoryToBlogPost_A_fkey` FOREIGN KEY (`A`) REFERENCES `BlogCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlogCategoryToBlogPost` ADD CONSTRAINT `_BlogCategoryToBlogPost_B_fkey` FOREIGN KEY (`B`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
