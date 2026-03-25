import { AuthScreen } from "@/lib/auth";

export function normalizeReturnTo(returnTo?: string) {
  if (!returnTo || !returnTo.startsWith("/")) {
    return "/court-manager";
  }

  return returnTo;
}

export function getAuthUrl() {
  return process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.rallyon.test";
}

export function buildSessionStartUrl(returnTo: string, screen: AuthScreen) {
  const url = new URL("/identity/session/start", getAuthUrl());
  url.searchParams.set("returnTo", returnTo);
  url.searchParams.set("screen", screen);
  return url.toString();
}
