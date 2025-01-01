-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "bannerImageUrl" TEXT,
    "prizeMoney" DOUBLE PRECISION,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "maxTeams" INTEGER NOT NULL,
    "teamSize" INTEGER NOT NULL,
    "pricePerTeam" DOUBLE PRECISION NOT NULL,
    "venueId" INTEGER NOT NULL,
    "sportType" TEXT NOT NULL,
    "rules" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "captainUserId" INTEGER NOT NULL,
    "teamSize" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "registrationStatus" TEXT NOT NULL DEFAULT 'pending',
    "contactNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "playerEmail" TEXT,
    "playerContact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "bannerImageUrl" TEXT,
    "coachName" TEXT NOT NULL,
    "coachBio" TEXT,
    "experienceYears" INTEGER,
    "durationWeeks" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "maxStudents" INTEGER,
    "venueId" INTEGER NOT NULL,
    "sportType" TEXT NOT NULL,
    "schedule" JSONB NOT NULL,
    "highlights" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachingProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingRegistration" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "age" INTEGER,
    "contactNumber" TEXT,
    "emergencyContact" TEXT,
    "medicalConditions" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "registrationStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachingRegistration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_captainUserId_fkey" FOREIGN KEY ("captainUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingProgram" ADD CONSTRAINT "CoachingProgram_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingRegistration" ADD CONSTRAINT "CoachingRegistration_programId_fkey" FOREIGN KEY ("programId") REFERENCES "CoachingProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingRegistration" ADD CONSTRAINT "CoachingRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
