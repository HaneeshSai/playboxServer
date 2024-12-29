/*
  Warnings:

  - You are about to drop the column `Dimentions` on the `Box` table. All the data in the column will be lost.
  - Added the required column `dimentions` to the `Box` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Box" DROP COLUMN "Dimentions",
ADD COLUMN     "dimentions" TEXT NOT NULL;
