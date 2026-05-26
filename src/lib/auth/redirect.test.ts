import { describe, expect, it } from "vitest";
import { authRoutes } from "@/app/(auth)/lib/auth-routes";
import {
  buildAuthRouteWithRedirect,
  normalizeAuthRedirectTarget,
} from "@/lib/auth/redirect";

describe("normalizeAuthRedirectTarget", () => {
  it("returns fallback for empty values", () => {
    expect(normalizeAuthRedirectTarget(null)).toBe("/dashboard");
    expect(normalizeAuthRedirectTarget(undefined, "/join/abc")).toBe(
      "/join/abc",
    );
  });

  it("rejects protocol-relative and absolute URLs", () => {
    expect(normalizeAuthRedirectTarget("//evil.test")).toBe("/dashboard");
    expect(normalizeAuthRedirectTarget("https://evil.test")).toBe("/dashboard");
  });

  it("allows same-origin paths", () => {
    expect(normalizeAuthRedirectTarget("/dashboard/organizations")).toBe(
      "/dashboard/organizations",
    );
  });
});

describe("buildAuthRouteWithRedirect", () => {
  it("builds login URL with encoded redirect", () => {
    expect(
      buildAuthRouteWithRedirect(
        authRoutes.login(),
        "/dashboard/organizations",
      ),
    ).toBe("/login?redirect=%2Fdashboard%2Forganizations");
  });
});
