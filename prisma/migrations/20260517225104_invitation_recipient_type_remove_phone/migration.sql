/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `invitation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "auth"."InvitationRecipientType" AS ENUM ('individual', 'group');

-- AlterTable
ALTER TABLE "auth"."invitation" DROP COLUMN "phoneNumber",
ADD COLUMN     "recipientType" "auth"."InvitationRecipientType" NOT NULL DEFAULT 'individual';
