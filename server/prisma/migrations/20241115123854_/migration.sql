/*
  Warnings:

  - You are about to drop the column `availabelSports` on the `Box` table. All the data in the column will be lost.
  - Added the required column `availableSports` to the `Box` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Box" DROP COLUMN "availabelSports",
ADD COLUMN     "availableSports" TEXT NOT NULL;
