import { describe, expect, it } from "vitest";
import {
  invitationIsConsumable,
  resolveInvitationDisplayStatus,
} from "@/lib/badge/invitation-display-status";

const baseInvitation = {
  expiresAt: "2099-01-01T00:00:00.000Z",
  usedCount: 0,
  maxUses: 5,
} as const;

describe("invitation display status", () => {
  it("marks expired invitations", () => {
    expect(
      resolveInvitationDisplayStatus(
        { ...baseInvitation, expiresAt: "2000-01-01T00:00:00.000Z" },
        Date.parse("2020-01-01T00:00:00.000Z"),
      ),
    ).toBe("expired");
  });

  it("marks exhausted invitations", () => {
    expect(
      resolveInvitationDisplayStatus({
        ...baseInvitation,
        usedCount: 5,
        maxUses: 5,
      }),
    ).toBe("exhausted");
  });

  it("treats active invitations as consumable", () => {
    expect(invitationIsConsumable(baseInvitation)).toBe(true);
    expect(resolveInvitationDisplayStatus(baseInvitation)).toBe("active_link");
  });
});
