/*
  Warnings:

  - You are about to drop the column `structureId` on the `Material` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Material` DROP FOREIGN KEY `Material_structureId_fkey`;

-- AlterTable
ALTER TABLE `Material` DROP COLUMN `structureId`;

-- CreateTable
CREATE TABLE `StructureMaterial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `materialId` INTEGER NOT NULL,
    `structureId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StructureMaterial` ADD CONSTRAINT `StructureMaterial_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StructureMaterial` ADD CONSTRAINT `StructureMaterial_structureId_fkey` FOREIGN KEY (`structureId`) REFERENCES `Structure`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
