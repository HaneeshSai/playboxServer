/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Box` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Box_ownerId_key" ON "Box"("ownerId");
