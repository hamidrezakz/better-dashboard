-- AlterTable
ALTER TABLE "auth"."notification" ADD COLUMN     "createdById" TEXT;

-- CreateIndex
CREATE INDEX "notification_createdById_idx" ON "auth"."notification"("createdById");

-- AddForeignKey
ALTER TABLE "auth"."notification" ADD CONSTRAINT "notification_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
