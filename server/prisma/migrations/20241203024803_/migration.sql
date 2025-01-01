/*
  Warnings:

  - You are about to drop the column `nextAvailableSpot` on the `currentStatus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[boxId]` on the table `currentStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "currentStatus" DROP COLUMN "nextAvailableSpot";

-- CreateIndex
CREATE UNIQUE INDEX "currentStatus_boxId_key" ON "currentStatus"("boxId");
