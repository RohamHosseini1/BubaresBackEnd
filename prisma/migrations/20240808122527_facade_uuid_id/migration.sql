/*
  Warnings:

  - The primary key for the `Facade` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_facadeId_fkey`;

-- AlterTable
ALTER TABLE `Facade` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Order` MODIFY `facadeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_facadeId_fkey` FOREIGN KEY (`facadeId`) REFERENCES `Facade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
