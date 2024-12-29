-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "extraPlayersNeeded" INTEGER,
ADD COLUMN     "joinedPlayers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "needExtraPlayers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refundAmount" DECIMAL(65,30),
ADD COLUMN     "remainingAmount" DECIMAL(65,30),
ADD COLUMN     "splitPricePerPlayer" DECIMAL(65,30);

-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "bookingId" INTEGER NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
