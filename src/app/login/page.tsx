"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  getCurrentUser,
  getKakaoOAuthURL,
  getOAuthRedirectUri,
  loginWithOAuth,
} from "@/lib/auth";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dummyError, setDummyError] = useState("");
  const [showDummyInput, setShowDummyInput] = useState(false);
  const [dummyCode, setDummyCode] = useState("");
  const [dummySubmitting, setDummySubmitting] = useState(false);
  const [isLocalRuntime, setIsLocalRuntime] = useState(false);
  const [freshDummyCode, setFreshDummyCode] = useState("fresh-local");
  const enableDummyLogin =
    process.env.NEXT_PUBLIC_ENABLE_DUMMY_LOGIN === "true" || isLocalRuntime;

  const returnTo = searchParams.get("returnTo") || "/court-manager";

  useEffect(() => {
    const host = window.location.hostname;
    setIsLocalRuntime(
      host === "localhost" ||
        host === "127.0.0.1" ||
        host.endsWith(".test") ||
        host.endsWith(".local")
    );
    setFreshDummyCode(createFreshDummyCode());
  }, []);

  const handleKakaoLogin = () => {
    window.location.href = getKakaoOAuthURL(returnTo);
  };

  const submitDummyLogin = async (codeOverride?: string) => {
    setDummyError("");
    const code = (codeOverride ?? dummyCode).trim();
    if (!code) {
      setDummyError("AuthorizationCode를 입력해 주세요.");
      return;
    }

    setDummySubmitting(true);
    try {
      const result = await loginWithOAuth({
        provider: "DUMMY",
        authorizationCode: code,
        redirectUri: getOAuthRedirectUri("DUMMY"),
      });

      if (!result.success) {
        setDummyError(result.error || "테스트 로그인에 실패했습니다.");
        return;
      }

      const userData = await getCurrentUser();
      if (!userData) {
        setDummyError("사용자 정보를 가져올 수 없습니다.");
        return;
      }

      if (userData.status === "PENDING") {
        router.push("/profile/setup");
        return;
      }

      router.push(returnTo);
    } catch (error) {
      setDummyError(
        error instanceof Error ? error.message : "테스트 로그인에 실패했습니다."
      );
    } finally {
      setDummySubmitting(false);
    }
  };

  const createFreshDummyCode = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.crypto !== "undefined" &&
      "randomUUID" in window.crypto
    ) {
      return `fresh-${window.crypto.randomUUID().slice(0, 8)}`;
    }

    return `fresh-${Date.now().toString(36)}`;
  };

  const quickDummyAccounts = [
    {
      code: "manager-local",
      label: "Manager A",
      description: "반복 테스트용 고정 관리자 계정",
    },
    {
      code: "player-local",
      label: "Player B",
      description: "반복 테스트용 두 번째 고정 계정",
    },
    {
      code: freshDummyCode,
      label: "Fresh User",
      description: "프로필 작성 플로우를 확인할 새 계정",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <Link
          href="/"
          className="mb-12 inline-flex items-center text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="border-2 border-zinc-800 bg-zinc-900 p-8 shadow-2xl md:p-10">
          <div className="mb-8 flex justify-center">
            <Logo variant="dark" className="h-8" />
          </div>

          <div className="mb-10 text-center">
            <h1 className="mb-3 font-display text-2xl font-bold uppercase tracking-tight text-white">
              환영합니다
            </h1>
            <p className="text-sm font-medium leading-relaxed text-zinc-400">
              랠리온의 모든 기능을 이용하려면
              <br />
              카카오 계정으로 로그인해주세요.
            </p>
          </div>

          <Button
            onClick={handleKakaoLogin}
            className="h-14 w-full justify-center gap-3 rounded-none bg-[#FEE500] text-base font-bold text-zinc-950 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:bg-[#FEE500]/90 active:translate-y-1 active:translate-x-1 active:shadow-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3c-5.523 0-10 3.49-10 7.8 0 2.76 1.83 5.18 4.6 6.5l-1.18 4.3c-.05.18.15.34.32.25l5.05-3.37c.39.05.79.08 1.21.08 5.523 0 10-3.49 10-7.8C22 6.49 17.523 3 12 3z" />
            </svg>
            카카오 로그인
          </Button>

          {enableDummyLogin && (
            <div className="mt-6 border-t border-zinc-800 pt-6">
              <div className="mb-4">
                <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                  Local Test Login
                </div>
                <p className="text-xs leading-relaxed text-zinc-500">
                  로컬 환경에서는 DUMMY provider로 바로 로그인할 수 있습니다.
                  첫 로그인인 계정은 프로필 입력 화면으로 이동합니다.
                </p>
              </div>

              <div className="space-y-3">
                {quickDummyAccounts.map((account) => (
                  <button
                    key={account.code}
                    type="button"
                    onClick={() => void submitDummyLogin(account.code)}
                    disabled={dummySubmitting}
                    className="w-full rounded-none border-2 border-amber-400 bg-amber-200 px-4 py-3 text-left text-amber-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="text-xs font-bold uppercase tracking-widest">
                      {account.label}
                    </div>
                    <div className="mt-1 text-[11px] font-medium text-amber-950/80">
                      {account.description}
                    </div>
                    <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-amber-950/70">
                      code: {account.code}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowDummyInput((prev) => !prev)}
                className="mt-4 w-full rounded-none border border-zinc-700 bg-zinc-950 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                {showDummyInput ? "직접 입력 닫기" : "직접 코드 입력"}
              </button>

              {showDummyInput && (
                <div className="mt-4 space-y-3 border border-amber-400 bg-amber-100/90 p-4 text-zinc-950">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-widest">
                    AuthorizationCode
                  </label>
                  <input
                    value={dummyCode}
                    onChange={(event) => setDummyCode(event.target.value)}
                    placeholder="dummy1"
                    className="w-full rounded-none border border-amber-500 bg-white px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1 rounded-none bg-slate-900 text-white hover:bg-slate-800"
                      onClick={() => void submitDummyLogin()}
                      disabled={dummySubmitting}
                    >
                      {dummySubmitting ? "로그인 중..." : "로그인"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-none"
                      onClick={() => {
                        setDummyError("");
                        setDummyCode("");
                        setShowDummyInput(false);
                      }}
                      disabled={dummySubmitting}
                    >
                      취소
                    </Button>
                  </div>
                  {dummyError && (
                    <p className="text-xs font-medium text-red-600">{dummyError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 border-t border-zinc-800 pt-6 text-center">
            <p className="text-xs font-medium text-zinc-600">
              로그인 시 랠리온의{" "}
              <Link href="#" className="text-zinc-400 underline underline-offset-2">
                이용약관
              </Link>{" "}
              및{" "}
              <Link href="#" className="text-zinc-400 underline underline-offset-2">
                개인정보처리방침
              </Link>
              에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <LoginPageContent />
    </Suspense>
  );
}
