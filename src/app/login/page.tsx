import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildAuthPageUrl,
  getAuthUrl,
  normalizeReturnTo,
} from "../auth-page-utils";
import LoginPageClient from "./login-page-client";

interface LoginPageProps {
  searchParams?: Promise<{
    returnTo?: string;
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const returnTo = normalizeReturnTo(params?.returnTo);
  const errorCode = params?.error;
  const headerStore = await headers();
  const host = (headerStore.get("host") || "").split(":")[0];
  const authHost = new URL(getAuthUrl()).host;

  if (host !== authHost) {
    redirect(buildAuthPageUrl(returnTo, "login"));
  }

  return <LoginPageClient returnTo={returnTo} errorCode={errorCode} />;
}
