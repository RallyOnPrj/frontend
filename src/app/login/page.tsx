import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginPageClient from "./login-page-client";

interface LoginPageProps {
  searchParams?: Promise<{
    returnTo?: string;
    error?: string;
  }>;
}

function normalizeReturnTo(returnTo?: string) {
  if (!returnTo || !returnTo.startsWith("/")) {
    return "/court-manager";
  }

  return returnTo;
}

function getAuthUrl() {
  return process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.rallyon.test";
}

function buildSessionStartUrl(returnTo: string) {
  const url = new URL("/identity/session/start", getAuthUrl());
  url.searchParams.set("returnTo", returnTo);
  return url.toString();
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const returnTo = normalizeReturnTo(params?.returnTo);
  const errorCode = params?.error;
  const headerStore = await headers();
  const host = (headerStore.get("host") || "").split(":")[0];
  const authHost = new URL(getAuthUrl()).host;

  if (host !== authHost) {
    redirect(buildSessionStartUrl(returnTo));
  }

  return <LoginPageClient returnTo={returnTo} errorCode={errorCode} />;
}
