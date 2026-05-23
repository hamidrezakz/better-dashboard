-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "exam";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "storage";

-- CreateEnum
CREATE TYPE "auth"."membership_visibility" AS ENUM ('PUBLIC', 'REQUEST_BASED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "auth"."membership_role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "auth"."membership_request_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "auth"."NotificationType" AS ENUM ('SYSTEM', 'INVITATION', 'ORGANIZATION', 'TEAM', 'SECURITY', 'BILLING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "auth"."NotificationAudience" AS ENUM ('USER_DIRECT', 'ORG_ALL', 'ORG_ADMINS', 'ORG_MEMBERS', 'TEAM');

-- CreateEnum
CREATE TYPE "storage"."activity_action" AS ENUM ('upload', 'download', 'delete');

-- CreateEnum
CREATE TYPE "storage"."storage_visibility" AS ENUM ('private', 'team', 'organization', 'public');

-- CreateEnum
CREATE TYPE "storage"."storage_object_status" AS ENUM ('active', 'archived', 'deleted');

-- CreateEnum
CREATE TYPE "storage"."upload_status" AS ENUM ('pending', 'complete', 'aborted', 'expired');

-- CreateEnum
CREATE TYPE "storage"."quota_owner_type" AS ENUM ('user', 'organization');

-- CreateEnum
CREATE TYPE "storage"."usage_period" AS ENUM ('daily', 'monthly');

-- CreateEnum
CREATE TYPE "exam"."exam_type" AS ENUM ('EXAM', 'SURVEY', 'QUESTIONNAIRE', 'ASSESSMENT', 'FORM');

-- CreateEnum
CREATE TYPE "exam"."exam_visibility" AS ENUM ('ANONYMOUS', 'PUBLIC', 'PRIVATE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "exam"."exam_status" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "exam"."question_type" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_TEXT', 'LONG_TEXT', 'NUMERIC', 'DATE', 'EMAIL', 'PHONE', 'FILE', 'RATING');

-- CreateEnum
CREATE TYPE "exam"."session_status" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'TIMED_OUT', 'ABANDONED');

-- CreateEnum
CREATE TYPE "exam"."enrollment_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'INVITED');

-- CreateEnum
CREATE TYPE "exam"."assignee_type" AS ENUM ('USER', 'TEAM', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "exam"."exam_file_role" AS ENUM ('ATTACHMENT', 'ANSWER_KEY');

-- CreateEnum
CREATE TYPE "exam"."metric_formula" AS ENUM ('AVERAGE', 'WEIGHTED_AVERAGE', 'SUM', 'MIN', 'MAX');

-- CreateTable
CREATE TABLE "auth"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT,
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "phoneNumberVerified" BOOLEAN,
    "metadata" JSONB,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,
    "activeOrganizationId" TEXT,
    "activeTeamId" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "visibility" "auth"."membership_visibility" NOT NULL DEFAULT 'PRIVATE',

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "visibility" "auth"."membership_visibility" NOT NULL DEFAULT 'PRIVATE',

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."teamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "teamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."member" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "auth"."membership_role" NOT NULL DEFAULT 'MEMBER',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."invitation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "teamId" TEXT,
    "examId" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "role" "auth"."membership_role",
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "inviterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."membership_request" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "teamId" TEXT,
    "requesterId" TEXT NOT NULL,
    "status" "auth"."membership_request_status" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membership_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."notification" (
    "id" TEXT NOT NULL,
    "type" "auth"."NotificationType" NOT NULL,
    "audience" "auth"."NotificationAudience" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "payload" JSONB,
    "userId" TEXT,
    "organizationId" TEXT,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage"."storage_activity_log" (
    "id" TEXT NOT NULL,
    "action" "storage"."activity_action" NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "bytes" BIGINT,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT,
    "team_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage"."storage_object" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "content_type" TEXT,
    "size" INTEGER,
    "etag" TEXT,
    "filename" TEXT,
    "name" TEXT,
    "description" TEXT,
    "visibility" "storage"."storage_visibility" NOT NULL DEFAULT 'private',
    "status" "storage"."storage_object_status" NOT NULL DEFAULT 'active',
    "public_url" TEXT,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT,
    "team_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "storage_object_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage"."upload" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "upload_id" TEXT,
    "content_type" TEXT,
    "declared_size" INTEGER,
    "verified_size" INTEGER,
    "etag" TEXT,
    "status" "storage"."upload_status" NOT NULL DEFAULT 'pending',
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT,
    "storage_object_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage"."storage_quota" (
    "id" TEXT NOT NULL,
    "owner_type" "storage"."quota_owner_type" NOT NULL DEFAULT 'organization',
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "max_bytes" BIGINT,
    "max_objects" INTEGER,
    "max_write_ops" INTEGER,
    "max_read_ops" INTEGER,
    "max_list_ops" INTEGER,
    "used_bytes" BIGINT NOT NULL DEFAULT 0,
    "used_objects" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage"."storage_usage" (
    "id" TEXT NOT NULL,
    "owner_type" "storage"."quota_owner_type" NOT NULL DEFAULT 'organization',
    "period" "storage"."usage_period" NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "total_bytes" BIGINT NOT NULL DEFAULT 0,
    "total_objects" INTEGER NOT NULL DEFAULT 0,
    "write_ops" INTEGER NOT NULL DEFAULT 0,
    "write_bytes" BIGINT NOT NULL DEFAULT 0,
    "read_ops" INTEGER NOT NULL DEFAULT 0,
    "read_bytes" BIGINT NOT NULL DEFAULT 0,
    "list_ops" INTEGER NOT NULL DEFAULT 0,
    "delete_ops" INTEGER NOT NULL DEFAULT 0,
    "delete_bytes" BIGINT NOT NULL DEFAULT 0,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "exam"."exam_type" NOT NULL DEFAULT 'EXAM',
    "visibility" "exam"."exam_visibility" NOT NULL DEFAULT 'PRIVATE',
    "status" "exam"."exam_status" NOT NULL DEFAULT 'DRAFT',
    "organizationId" TEXT,
    "createdById" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "timeLimitMin" INTEGER,
    "variables" JSONB,
    "cachedScores" JSONB,
    "settings" JSONB,
    "tags" TEXT[],
    "aiNote" TEXT,
    "profileOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."exam_section" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "timeLimitMin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."question" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" "exam"."question_type" NOT NULL,
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "text" TEXT NOT NULL,
    "hint" TEXT,
    "mediaObjectId" TEXT,
    "options" JSONB,
    "correctAnswer" JSONB,
    "points" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."exam_session" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "participantId" TEXT,
    "ipAddress" TEXT,
    "targetId" TEXT,
    "status" "exam"."session_status" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "scores" JSONB,
    "maxScores" JSONB,
    "progress" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."answer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "isCorrect" BOOLEAN,
    "scores" JSONB,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."exam_enrollment" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "exam"."enrollment_status" NOT NULL DEFAULT 'PENDING',
    "targetId" TEXT,
    "invitationId" TEXT,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),

    CONSTRAINT "exam_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."exam_assignment" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "assigneeType" "exam"."assignee_type" NOT NULL,
    "assignedUserId" TEXT,
    "assignedTeamId" TEXT,
    "assignedOrganizationId" TEXT,
    "assignedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."exam_file" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "role" "exam"."exam_file_role" NOT NULL,
    "storageObjectId" TEXT NOT NULL,
    "label" TEXT,
    "releasedAt" TIMESTAMP(3),
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."org_metric_definition" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "formula" "exam"."metric_formula" NOT NULL DEFAULT 'WEIGHTED_AVERAGE',
    "sources" JSONB NOT NULL,
    "profileOrder" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_metric_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam"."org_metric_value" (
    "id" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "breakdown" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_metric_value_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "auth"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "auth"."user"("phoneNumber");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "auth"."session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "auth"."session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "auth"."account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "auth"."verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "auth"."organization"("slug");

-- CreateIndex
CREATE INDEX "team_organizationId_idx" ON "auth"."team"("organizationId");

-- CreateIndex
CREATE INDEX "teamMember_teamId_idx" ON "auth"."teamMember"("teamId");

-- CreateIndex
CREATE INDEX "teamMember_userId_idx" ON "auth"."teamMember"("userId");

-- CreateIndex
CREATE INDEX "member_organizationId_idx" ON "auth"."member"("organizationId");

-- CreateIndex
CREATE INDEX "member_userId_idx" ON "auth"."member"("userId");

-- CreateIndex
CREATE INDEX "invitation_organizationId_idx" ON "auth"."invitation"("organizationId");

-- CreateIndex
CREATE INDEX "invitation_teamId_idx" ON "auth"."invitation"("teamId");

-- CreateIndex
CREATE INDEX "invitation_examId_idx" ON "auth"."invitation"("examId");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "auth"."invitation"("email");

-- CreateIndex
CREATE INDEX "membership_request_organizationId_idx" ON "auth"."membership_request"("organizationId");

-- CreateIndex
CREATE INDEX "membership_request_teamId_idx" ON "auth"."membership_request"("teamId");

-- CreateIndex
CREATE INDEX "membership_request_requesterId_idx" ON "auth"."membership_request"("requesterId");

-- CreateIndex
CREATE UNIQUE INDEX "membership_request_organizationId_requesterId_teamId_key" ON "auth"."membership_request"("organizationId", "requesterId", "teamId");

-- CreateIndex
CREATE INDEX "notification_type_idx" ON "auth"."notification"("type");

-- CreateIndex
CREATE INDEX "notification_audience_idx" ON "auth"."notification"("audience");

-- CreateIndex
CREATE INDEX "notification_userId_idx" ON "auth"."notification"("userId");

-- CreateIndex
CREATE INDEX "notification_organizationId_idx" ON "auth"."notification"("organizationId");

-- CreateIndex
CREATE INDEX "notification_teamId_idx" ON "auth"."notification"("teamId");

-- CreateIndex
CREATE INDEX "notification_createdAt_idx" ON "auth"."notification"("createdAt");

-- CreateIndex
CREATE INDEX "storage_activity_log_user_id_created_at_idx" ON "storage"."storage_activity_log"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "storage_activity_log_organization_id_created_at_idx" ON "storage"."storage_activity_log"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "storage_activity_log_key_idx" ON "storage"."storage_activity_log"("key");

-- CreateIndex
CREATE INDEX "storage_activity_log_action_created_at_idx" ON "storage"."storage_activity_log"("action", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "storage_object_key_key" ON "storage"."storage_object"("key");

-- CreateIndex
CREATE INDEX "storage_object_user_id_idx" ON "storage"."storage_object"("user_id");

-- CreateIndex
CREATE INDEX "storage_object_organization_id_idx" ON "storage"."storage_object"("organization_id");

-- CreateIndex
CREATE INDEX "storage_object_team_id_idx" ON "storage"."storage_object"("team_id");

-- CreateIndex
CREATE INDEX "storage_object_status_idx" ON "storage"."storage_object"("status");

-- CreateIndex
CREATE INDEX "storage_object_bucket_key_idx" ON "storage"."storage_object"("bucket", "key");

-- CreateIndex
CREATE UNIQUE INDEX "upload_key_key" ON "storage"."upload"("key");

-- CreateIndex
CREATE UNIQUE INDEX "upload_storage_object_id_key" ON "storage"."upload"("storage_object_id");

-- CreateIndex
CREATE INDEX "upload_user_id_idx" ON "storage"."upload"("user_id");

-- CreateIndex
CREATE INDEX "upload_organization_id_idx" ON "storage"."upload"("organization_id");

-- CreateIndex
CREATE INDEX "upload_status_created_at_idx" ON "storage"."upload"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "storage_quota_organization_id_key" ON "storage"."storage_quota"("organization_id");

-- CreateIndex
CREATE INDEX "storage_quota_user_id_idx" ON "storage"."storage_quota"("user_id");

-- CreateIndex
CREATE INDEX "storage_usage_user_id_idx" ON "storage"."storage_usage"("user_id");

-- CreateIndex
CREATE INDEX "storage_usage_organization_id_period_idx" ON "storage"."storage_usage"("organization_id", "period");

-- CreateIndex
CREATE INDEX "storage_usage_period_start_idx" ON "storage"."storage_usage"("period_start");

-- CreateIndex
CREATE UNIQUE INDEX "storage_usage_organization_id_period_period_start_key" ON "storage"."storage_usage"("organization_id", "period", "period_start");

-- CreateIndex
CREATE INDEX "exam_organizationId_idx" ON "exam"."exam"("organizationId");

-- CreateIndex
CREATE INDEX "exam_createdById_idx" ON "exam"."exam"("createdById");

-- CreateIndex
CREATE INDEX "exam_status_idx" ON "exam"."exam"("status");

-- CreateIndex
CREATE INDEX "exam_section_examId_idx" ON "exam"."exam_section"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_section_examId_order_key" ON "exam"."exam_section"("examId", "order");

-- CreateIndex
CREATE INDEX "question_sectionId_idx" ON "exam"."question"("sectionId");

-- CreateIndex
CREATE INDEX "question_mediaObjectId_idx" ON "exam"."question"("mediaObjectId");

-- CreateIndex
CREATE UNIQUE INDEX "question_sectionId_order_key" ON "exam"."question"("sectionId", "order");

-- CreateIndex
CREATE INDEX "exam_session_examId_idx" ON "exam"."exam_session"("examId");

-- CreateIndex
CREATE INDEX "exam_session_participantId_idx" ON "exam"."exam_session"("participantId");

-- CreateIndex
CREATE INDEX "exam_session_targetId_idx" ON "exam"."exam_session"("targetId");

-- CreateIndex
CREATE INDEX "answer_sessionId_idx" ON "exam"."answer"("sessionId");

-- CreateIndex
CREATE INDEX "answer_questionId_idx" ON "exam"."answer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "answer_sessionId_questionId_key" ON "exam"."answer"("sessionId", "questionId");

-- CreateIndex
CREATE INDEX "exam_enrollment_examId_idx" ON "exam"."exam_enrollment"("examId");

-- CreateIndex
CREATE INDEX "exam_enrollment_userId_idx" ON "exam"."exam_enrollment"("userId");

-- CreateIndex
CREATE INDEX "exam_enrollment_targetId_idx" ON "exam"."exam_enrollment"("targetId");

-- CreateIndex
CREATE INDEX "exam_enrollment_invitationId_idx" ON "exam"."exam_enrollment"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_enrollment_examId_userId_targetId_key" ON "exam"."exam_enrollment"("examId", "userId", "targetId");

-- CreateIndex
CREATE INDEX "exam_assignment_examId_idx" ON "exam"."exam_assignment"("examId");

-- CreateIndex
CREATE INDEX "exam_assignment_assignedUserId_idx" ON "exam"."exam_assignment"("assignedUserId");

-- CreateIndex
CREATE INDEX "exam_assignment_assignedTeamId_idx" ON "exam"."exam_assignment"("assignedTeamId");

-- CreateIndex
CREATE INDEX "exam_assignment_assignedOrganizationId_idx" ON "exam"."exam_assignment"("assignedOrganizationId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_assignment_examId_assignedUserId_key" ON "exam"."exam_assignment"("examId", "assignedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_assignment_examId_assignedTeamId_key" ON "exam"."exam_assignment"("examId", "assignedTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_assignment_examId_assignedOrganizationId_key" ON "exam"."exam_assignment"("examId", "assignedOrganizationId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_file_storageObjectId_key" ON "exam"."exam_file"("storageObjectId");

-- CreateIndex
CREATE INDEX "exam_file_examId_idx" ON "exam"."exam_file"("examId");

-- CreateIndex
CREATE INDEX "exam_file_uploadedById_idx" ON "exam"."exam_file"("uploadedById");

-- CreateIndex
CREATE INDEX "org_metric_definition_organizationId_idx" ON "exam"."org_metric_definition"("organizationId");

-- CreateIndex
CREATE INDEX "org_metric_definition_createdById_idx" ON "exam"."org_metric_definition"("createdById");

-- CreateIndex
CREATE INDEX "org_metric_value_definitionId_idx" ON "exam"."org_metric_value"("definitionId");

-- CreateIndex
CREATE INDEX "org_metric_value_subjectId_idx" ON "exam"."org_metric_value"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "org_metric_value_definitionId_subjectId_key" ON "exam"."org_metric_value"("definitionId", "subjectId");

-- AddForeignKey
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."team" ADD CONSTRAINT "team_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."teamMember" ADD CONSTRAINT "teamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "auth"."team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."teamMember" ADD CONSTRAINT "teamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "auth"."team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"."exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."membership_request" ADD CONSTRAINT "membership_request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."membership_request" ADD CONSTRAINT "membership_request_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "auth"."team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."membership_request" ADD CONSTRAINT "membership_request_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."membership_request" ADD CONSTRAINT "membership_request_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "auth"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."notification" ADD CONSTRAINT "notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "auth"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."notification" ADD CONSTRAINT "notification_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "auth"."team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_activity_log" ADD CONSTRAINT "storage_activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_activity_log" ADD CONSTRAINT "storage_activity_log_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "auth"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_object" ADD CONSTRAINT "storage_object_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_object" ADD CONSTRAINT "storage_object_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "auth"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_object" ADD CONSTRAINT "storage_object_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "auth"."team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."upload" ADD CONSTRAINT "upload_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."upload" ADD CONSTRAINT "upload_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "auth"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."upload" ADD CONSTRAINT "upload_storage_object_id_fkey" FOREIGN KEY ("storage_object_id") REFERENCES "storage"."storage_object"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_quota" ADD CONSTRAINT "storage_quota_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_quota" ADD CONSTRAINT "storage_quota_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_usage" ADD CONSTRAINT "storage_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storage"."storage_usage" ADD CONSTRAINT "storage_usage_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam" ADD CONSTRAINT "exam_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "auth"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam" ADD CONSTRAINT "exam_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_section" ADD CONSTRAINT "exam_section_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"."exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."question" ADD CONSTRAINT "question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "exam"."exam_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."question" ADD CONSTRAINT "question_mediaObjectId_fkey" FOREIGN KEY ("mediaObjectId") REFERENCES "storage"."storage_object"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_session" ADD CONSTRAINT "exam_session_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"."exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_session" ADD CONSTRAINT "exam_session_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_session" ADD CONSTRAINT "exam_session_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "auth"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."answer" ADD CONSTRAINT "answer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "exam"."exam_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."answer" ADD CONSTRAINT "answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "exam"."question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_enrollment" ADD CONSTRAINT "exam_enrollment_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"."exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_enrollment" ADD CONSTRAINT "exam_enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_enrollment" ADD CONSTRAINT "exam_enrollment_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "auth"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_enrollment" ADD CONSTRAINT "exam_enrollment_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "auth"."invitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_assignment" ADD CONSTRAINT "exam_assignment_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"."exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_assignment" ADD CONSTRAINT "exam_assignment_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_assignment" ADD CONSTRAINT "exam_assignment_assignedTeamId_fkey" FOREIGN KEY ("assignedTeamId") REFERENCES "auth"."team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_assignment" ADD CONSTRAINT "exam_assignment_assignedOrganizationId_fkey" FOREIGN KEY ("assignedOrganizationId") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_assignment" ADD CONSTRAINT "exam_assignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_file" ADD CONSTRAINT "exam_file_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"."exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_file" ADD CONSTRAINT "exam_file_storageObjectId_fkey" FOREIGN KEY ("storageObjectId") REFERENCES "storage"."storage_object"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."exam_file" ADD CONSTRAINT "exam_file_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."org_metric_definition" ADD CONSTRAINT "org_metric_definition_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "auth"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."org_metric_definition" ADD CONSTRAINT "org_metric_definition_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."org_metric_value" ADD CONSTRAINT "org_metric_value_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "exam"."org_metric_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam"."org_metric_value" ADD CONSTRAINT "org_metric_value_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
