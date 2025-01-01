-- CreateTable
CREATE TABLE "Box" (
    "id" SERIAL NOT NULL,
    "ownersName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "Dimentions" TEXT NOT NULL,
    "availabelSports" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT,
    "refundPolicy" TEXT,

    CONSTRAINT "Box_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currentStatus" (
    "id" SERIAL NOT NULL,
    "totalTeamSize" INTEGER NOT NULL,
    "currentTeamSize" INTEGER NOT NULL,
    "nextAvailableSpot" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "currentStatus_pkey" PRIMARY KEY ("id")
);
