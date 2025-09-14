/*
  Warnings:

  - You are about to drop the column `certifierID` on the `Batch` table. All the data in the column will be lost.
  - Added the required column `certifierId` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Batch" DROP CONSTRAINT "Batch_certifierID_fkey";

-- AlterTable
ALTER TABLE "public"."Batch" DROP COLUMN "certifierID",
ADD COLUMN     "certifierId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."ProducerCertifier" (
    "id" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "certifierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProducerCertifier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProducerCertifier" ADD CONSTRAINT "ProducerCertifier_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProducerCertifier" ADD CONSTRAINT "ProducerCertifier_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
