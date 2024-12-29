/*
  Warnings:

  - You are about to drop the `player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "player" DROP CONSTRAINT "player_bookingId_fkey";

-- DropTable
DROP TABLE "player";

-- CreateTable
CREATE TABLE "extraPlayers" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "userId" INTEGER NOT NULL,
    "numberOfPlayers" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "extraPlayers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "extraPlayers" ADD CONSTRAINT "extraPlayers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraPlayers" ADD CONSTRAINT "extraPlayers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
