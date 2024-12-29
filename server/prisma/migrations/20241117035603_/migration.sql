/*
  Warnings:

  - Added the required column `status` to the `currentStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currentStatus" ADD COLUMN     "status" TEXT NOT NULL;
