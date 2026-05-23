/*
  Warnings:

  - The `status` column on the `invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "auth"."InvitationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'canceled');

-- AlterTable
ALTER TABLE "auth"."invitation" DROP COLUMN "status",
ADD COLUMN     "status" "auth"."InvitationStatus" NOT NULL DEFAULT 'pending';
