/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `FAQ` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `FAQ` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FAQ` ADD COLUMN `position` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FAQ_position_key` ON `FAQ`(`position`);
