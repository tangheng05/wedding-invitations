-- CreateEnum
CREATE TYPE "public"."RSVPStatus" AS ENUM ('PENDING', 'ATTENDING', 'NOT_ATTENDING', 'RESPONDED');

-- CreateTable
CREATE TABLE "public"."admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "relationship" TEXT,
    "uniqueLink" TEXT NOT NULL,
    "rsvpStatus" "public"."RSVPStatus" NOT NULL DEFAULT 'PENDING',
    "plusOne" BOOLEAN NOT NULL DEFAULT false,
    "plusOneName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rsvps" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "dietaryRestrictions" TEXT,
    "plusOne" BOOLEAN NOT NULL DEFAULT false,
    "plusOneName" TEXT,
    "message" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wedding_settings" (
    "id" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "weddingDate" TEXT NOT NULL,
    "weddingTime" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "venueCity" TEXT NOT NULL,
    "venueState" TEXT NOT NULL,
    "venueZip" TEXT NOT NULL,
    "venueCountry" TEXT NOT NULL,
    "googleMapsUrl" TEXT NOT NULL,
    "ceremonyTime" TEXT NOT NULL,
    "receptionTime" TEXT NOT NULL,
    "dressCode" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,
    "storyMessage" TEXT NOT NULL,
    "rsvpMessage" TEXT NOT NULL,
    "couplePhoto" TEXT NOT NULL,
    "venuePhoto" TEXT NOT NULL,
    "preweddingPhotos" TEXT[],
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "accommodationInfo" TEXT NOT NULL,
    "transportationInfo" TEXT NOT NULL,
    "giftInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "public"."admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guests_uniqueLink_key" ON "public"."guests"("uniqueLink");

-- CreateIndex
CREATE INDEX "guests_email_idx" ON "public"."guests"("email");

-- CreateIndex
CREATE INDEX "guests_rsvpStatus_idx" ON "public"."guests"("rsvpStatus");

-- CreateIndex
CREATE UNIQUE INDEX "rsvps_guestId_key" ON "public"."rsvps"("guestId");

-- CreateIndex
CREATE INDEX "rsvps_attending_idx" ON "public"."rsvps"("attending");

-- CreateIndex
CREATE INDEX "rsvps_submittedAt_idx" ON "public"."rsvps"("submittedAt");

-- AddForeignKey
ALTER TABLE "public"."rsvps" ADD CONSTRAINT "rsvps_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "public"."guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
