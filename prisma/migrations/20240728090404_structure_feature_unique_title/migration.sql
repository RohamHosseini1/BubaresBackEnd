/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `StructureFeature` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `StructureFeature_title_key` ON `StructureFeature`(`title`);
