# Better Auth schema: default vs this template

Documents how **`better-auth.prisma`** (this repo) differs from the **default Better Auth CLI schema** in [`default-better-auth-schima.txt`](./default-better-auth-schima.txt).

|                             | File                             |
| --------------------------- | -------------------------------- |
| **Default** (upstream CLI)  | `default-better-auth-schima.txt` |
| **Template** (what we ship) | `better-auth.prisma`             |

Filename typo (`schima`) is intentional — keep stable links.

---

## Quick diff

| Topic             | Default Better Auth                                                | This template                                                                        |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| PostgreSQL layout | Implicit / public                                                  | All models in schema `auth` (`@@schema("auth")`)                                     |
| Primary keys      | `@id` only                                                         | `@id @default(cuid())` on every model                                                |
| `User.role`       | `String?` (admin plugin)                                           | `UserRole` enum (`user`, `admin`) + ban fields (`banned`, `banReason`, `banExpires`) |
| `Session`         | —                                                                  | `impersonatedBy` (admin plugin)                                                      |
| `Member.role`     | `String` default `"member"`                                        | `MembershipRole` enum (`owner`, `admin`, `member`) — aligned with Better Auth        |
| `Invitation`      | Email invite: `email`, `role`, `status`, required `organizationId` | Shareable **link**: optional org/team, `maxUses` / `usedCount`, no email/role/status |
| `Team`            | —                                                                  | `invitations`, `notifications` relations                                             |
| Notifications     | —                                                                  | `Notification` model + `NotificationType` / `NotificationAudience` enums             |

**Same as default** (only global rows above): `Account`, `Verification`, `TeamMember`, `Session`, `Organization.metadata` (`String?` — store JSON as a string if you need structured data).

---

## Global (all models)

```prisma
@@schema("auth")

id String @id @default(cuid())  // default: id String @id
```

Datasource: `schemas = ["auth"]` in [`schema.prisma`](./schema.prisma).

---

## Template-only enums

| Enum                   | Replaces / purpose                                            |
| ---------------------- | ------------------------------------------------------------- |
| `UserRole`             | `User.role` for Better Auth admin plugin (`user` / `admin`)   |
| `MembershipRole`       | `Member.role` (`owner`, `admin`, `member`)                    |
| `NotificationType`     | `system`, `organization`, `security`, `custom`                |
| `NotificationAudience` | `user_direct`, `org_all`, `org_admins`, `org_members`, `team` |

UI labels: [`src/lib/badge/badge-labels.ts`](../src/lib/badge/badge-labels.ts), [`src/components/badge/badge-config.tsx`](../src/components/badge/badge-config.tsx).

---

## Model changes

### `Invitation`

|                           | Default                   | Template                                    |
| ------------------------- | ------------------------- | ------------------------------------------- |
| Purpose                   | Invite one email          | Shareable link                              |
| `organizationId`          | Required                  | Optional (`null` = team-only)               |
| `teamId`                  | Optional                  | Optional + `Team` relation                  |
| `email`, `role`, `status` | Yes                       | **Removed**                                 |
| Capacity                  | —                         | `maxUses` (`null` = unlimited), `usedCount` |
| Inviter relation          | `user`                    | `inviter` (same `inviterId`)                |
| Indexes                   | `organizationId`, `email` | `organizationId`, `teamId`                  |

### `Notification` (new)

`type`, `audience`, `title`, `body`, `payload`; optional `userId`, `createdById`, `organizationId`, `teamId`; `readAt`, `expiresAt`, timestamps.

### Other

| Model          | Change                                   |
| -------------- | ---------------------------------------- |
| `User`         | Notification recipient/creator relations |
| `Organization` | `notifications[]`                        |
| `Member`       | `role` → `MembershipRole`                |
| `Team`         | `invitations[]`, `notifications[]`       |

---

## Upgrading Better Auth

`pnpm auth:generate` overwrites **`better-auth.prisma`** — merge using this doc, then `pnpm exec prisma generate` (and migrate when the DB should change).

---

## Prisma folder

| File                                | Role                            |
| ----------------------------------- | ------------------------------- |
| `schema.prisma`                     | Generator + datasource (`auth`) |
| `better-auth.prisma`                | **Source of truth**             |
| `default-better-auth-schima.txt`    | Frozen default CLI output       |
| `better-auth-schema-differences.md` | This file                       |
| `migrations/`                       | SQL for `auth`                  |
