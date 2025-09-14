/*
  Warnings:

  - You are about to drop the `Kyc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Kyc" DROP CONSTRAINT "Kyc_usedId_fkey";

-- DropTable
DROP TABLE "public"."Kyc";

-- CreateTable
CREATE TABLE "public"."ProducerKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plantName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "ProducerKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CertifierKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "qualification" TEXT,
    "document" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "CertifierKyc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProducerKyc_userId_key" ON "public"."ProducerKyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CertifierKyc_userId_key" ON "public"."CertifierKyc"("userId");

-- AddForeignKey
ALTER TABLE "public"."ProducerKyc" ADD CONSTRAINT "ProducerKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CertifierKyc" ADD CONSTRAINT "CertifierKyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
