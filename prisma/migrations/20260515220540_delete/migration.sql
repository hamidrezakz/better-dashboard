/*
  Warnings:

  - You are about to drop the column `banExpires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banReason` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumberVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `membership_request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth"."membership_request" DROP CONSTRAINT "membership_request_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."membership_request" DROP CONSTRAINT "membership_request_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."membership_request" DROP CONSTRAINT "membership_request_reviewedById_fkey";

-- DropForeignKey
ALTER TABLE "auth"."membership_request" DROP CONSTRAINT "membership_request_teamId_fkey";

-- DropIndex
DROP INDEX "auth"."user_phoneNumber_key";

-- AlterTable
ALTER TABLE "auth"."user" DROP COLUMN "banExpires",
DROP COLUMN "banReason",
DROP COLUMN "banned",
DROP COLUMN "phoneNumber",
DROP COLUMN "phoneNumberVerified",
DROP COLUMN "role";

-- DropTable
DROP TABLE "auth"."membership_request";
