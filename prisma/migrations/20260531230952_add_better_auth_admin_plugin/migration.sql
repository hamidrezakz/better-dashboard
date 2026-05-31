-- CreateEnum
CREATE TYPE "auth"."user_role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "auth"."session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "auth"."user" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "auth"."user_role" NOT NULL DEFAULT 'user';
