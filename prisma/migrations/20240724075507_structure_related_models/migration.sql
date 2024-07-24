/*
  Warnings:

  - Added the required column `title` to the `StructureFeature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Material` ADD COLUMN `structureId` INTEGER NULL;

-- AlterTable
ALTER TABLE `StructureFeature` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Facade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `modelKey` VARCHAR(191) NOT NULL,
    `thumbnailKey` VARCHAR(191) NOT NULL,
    `structureId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Structure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `application` ENUM('TOURISM', 'OFFICIAL', 'RESIDENTIAL', 'TREATMENT') NOT NULL,
    `floorsNumber` INTEGER NOT NULL,
    `sizeFrom` INTEGER NOT NULL,
    `sizeTo` INTEGER NOT NULL,
    `province` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_StructureToStructureFeature` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StructureToStructureFeature_AB_unique`(`A`, `B`),
    INDEX `_StructureToStructureFeature_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_structureId_fkey` FOREIGN KEY (`structureId`) REFERENCES `Structure`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facade` ADD CONSTRAINT `Facade_structureId_fkey` FOREIGN KEY (`structureId`) REFERENCES `Structure`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StructureToStructureFeature` ADD CONSTRAINT `_StructureToStructureFeature_A_fkey` FOREIGN KEY (`A`) REFERENCES `Structure`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StructureToStructureFeature` ADD CONSTRAINT `_StructureToStructureFeature_B_fkey` FOREIGN KEY (`B`) REFERENCES `StructureFeature`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
