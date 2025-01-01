/*
  Warnings:

  - Added the required column `isOpen` to the `currentStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currentStatus" ADD COLUMN     "isOpen" TEXT NOT NULL;
