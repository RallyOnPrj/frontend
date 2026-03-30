import { normalizeReturnTo } from "../auth-page-utils";
import SignupPageClient from "./signup-page-client";

interface SignupPageProps {
  searchParams?: Promise<{
    returnTo?: string;
    error?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const returnTo = normalizeReturnTo(params?.returnTo);
  const errorCode = params?.error;

  return <SignupPageClient returnTo={returnTo} errorCode={errorCode} />;
}
