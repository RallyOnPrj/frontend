import { AuthScreen } from "@/lib/auth";

export function normalizeReturnTo(returnTo?: string) {
  if (!returnTo || !returnTo.startsWith("/")) {
    return "/profile";
  }

  return returnTo;
}

export function getAuthUrl() {
  return process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.rallyon.test";
}

export function buildAuthPageUrl(returnTo: string, screen: AuthScreen) {
  const url = new URL(`/${screen}`, getAuthUrl());
  url.searchParams.set("returnTo", returnTo);
  return url.toString();
}

export function resolveRequestHost(headerStore: Headers) {
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost || headerStore.get("host") || "";
  return host.split(",")[0].trim().split(":")[0];
}
