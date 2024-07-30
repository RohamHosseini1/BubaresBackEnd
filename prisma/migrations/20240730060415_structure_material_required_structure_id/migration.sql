/*
  Warnings:

  - Made the column `structureId` on table `StructureMaterial` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `StructureMaterial` DROP FOREIGN KEY `StructureMaterial_structureId_fkey`;

-- AlterTable
ALTER TABLE `StructureMaterial` MODIFY `structureId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `StructureMaterial` ADD CONSTRAINT `StructureMaterial_structureId_fkey` FOREIGN KEY (`structureId`) REFERENCES `Structure`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
