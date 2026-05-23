/*
  Warnings:

  - You are about to drop the column `email` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the column `recipientType` on the `invitation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "auth"."invitation_email_idx";

-- AlterTable
ALTER TABLE "auth"."invitation" DROP COLUMN "email",
DROP COLUMN "recipientType";

-- DropEnum
DROP TYPE "auth"."InvitationRecipientType";
