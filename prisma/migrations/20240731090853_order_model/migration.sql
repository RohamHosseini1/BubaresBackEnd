/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `OrderRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `application` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorsNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` DROP PRIMARY KEY,
    ADD COLUMN `application` ENUM('TOURISM', 'OFFICIAL', 'RESIDENTIAL', 'TREATMENT') NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `facadeId` INTEGER NULL,
    ADD COLUMN `facadeTitle` VARCHAR(191) NULL,
    ADD COLUMN `floorsNumber` INTEGER NOT NULL,
    ADD COLUMN `neighborhood` VARCHAR(191) NULL,
    ADD COLUMN `province` JSON NOT NULL,
    ADD COLUMN `size` INTEGER NOT NULL,
    ADD COLUMN `village` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'SUCCESSFUL', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `StructureFeature` ADD COLUMN `orderRequestId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `OrderRequest`;

-- CreateTable
CREATE TABLE `_OrderToStructureFeature` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OrderToStructureFeature_AB_unique`(`A`, `B`),
    INDEX `_OrderToStructureFeature_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_facadeId_fkey` FOREIGN KEY (`facadeId`) REFERENCES `Facade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToStructureFeature` ADD CONSTRAINT `_OrderToStructureFeature_A_fkey` FOREIGN KEY (`A`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToStructureFeature` ADD CONSTRAINT `_OrderToStructureFeature_B_fkey` FOREIGN KEY (`B`) REFERENCES `StructureFeature`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
