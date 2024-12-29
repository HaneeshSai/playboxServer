/*
  Warnings:

  - Added the required column `boxId` to the `currentStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currentStatus" ADD COLUMN     "boxId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "teamName" TEXT NOT NULL,
    "totalTeamSize" INTEGER NOT NULL,
    "currentTeamSize" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "paymentStatus" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "boxId" INTEGER NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "currentStatus" ADD CONSTRAINT "currentStatus_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
