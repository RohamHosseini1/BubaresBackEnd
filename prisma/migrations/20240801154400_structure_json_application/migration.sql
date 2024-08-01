/*
  Warnings:

  - You are about to alter the column `application` on the `Structure` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Json`.

*/
-- AlterTable
ALTER TABLE `Structure` MODIFY `application` JSON NOT NULL;

-- AlterTable
ALTER TABLE `StructureFeature` ADD COLUMN `description` VARCHAR(191) NULL;
