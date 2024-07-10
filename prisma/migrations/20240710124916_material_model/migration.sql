/*
  Warnings:

  - You are about to alter the column `category` on the `FAQ` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[slug]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `body` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortBody` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BlogPost` ADD COLUMN `body` TEXT NOT NULL,
    ADD COLUMN `shortBody` VARCHAR(191) NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `FAQ` ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `category` ENUM('PRE_FABRICATED', 'ORDER_PROCESS', 'PAYMENT_TERMS', 'CONSTRUCTION_COST', 'PERMITS') NOT NULL;

-- AlterTable
ALTER TABLE `Material` ADD COLUMN `unit` ENUM('KG', 'M', 'M2', 'M3') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `BlogPost_slug_key` ON `BlogPost`(`slug`);
