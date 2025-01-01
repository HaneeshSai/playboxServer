/*
  Warnings:

  - Changed the type of `nextAvailableSpot` on the `currentStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "currentStatus" DROP COLUMN "nextAvailableSpot",
ADD COLUMN     "nextAvailableSpot" TIMESTAMP(3) NOT NULL;
