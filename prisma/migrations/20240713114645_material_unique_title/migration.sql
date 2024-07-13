/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Material_title_key` ON `Material`(`title`);
