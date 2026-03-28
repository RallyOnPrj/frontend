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

function normalizeHeaderHost(value?: string | null) {
  return (value || "").split(",")[0].trim().split(":")[0];
}

export function buildAuthPageUrl(returnTo: string, screen: AuthScreen) {
  const url = new URL(`/${screen}`, getAuthUrl());
  url.searchParams.set("returnTo", returnTo);
  return url.toString();
}

export function resolveRequestHost(headerStore: Headers) {
  const publicHost = normalizeHeaderHost(
    headerStore.get("x-rallyon-public-host"),
  );
  if (publicHost) {
    return publicHost;
  }

  const forwardedHost = normalizeHeaderHost(
    headerStore.get("x-forwarded-host"),
  );
  if (forwardedHost) {
    return forwardedHost;
  }

  return normalizeHeaderHost(headerStore.get("host"));
}
