-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('PRODUCER', 'CONSUMER', 'SUPER_ADMIN', 'CERTIFIER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('PENDING', 'APPROVAL', 'REJECT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "authProvider" "public"."AuthProvider" NOT NULL DEFAULT 'LOCAL',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'PENDING',
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kyc" (
    "id" TEXT NOT NULL,
    "usedId" TEXT NOT NULL,
    "Plantname" TEXT,
    "Location" TEXT,
    "document" TEXT,
    "ApprovedBy" TEXT,
    "ApprovedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Batch" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "certifierID" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "metaDataURI" TEXT,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_usedId_key" ON "public"."Kyc"("usedId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchId_key" ON "public"."Batch"("batchId");

-- AddForeignKey
ALTER TABLE "public"."Kyc" ADD CONSTRAINT "Kyc_usedId_fkey" FOREIGN KEY ("usedId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_certifierID_fkey" FOREIGN KEY ("certifierID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
