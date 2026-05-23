/*
  Warnings:

  - You are about to drop the column `visibility` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth"."organization" DROP COLUMN "visibility";

-- AlterTable
ALTER TABLE "auth"."team" DROP COLUMN "visibility";

-- DropEnum
DROP TYPE "auth"."membership_request_status";

-- DropEnum
DROP TYPE "auth"."membership_visibility";
