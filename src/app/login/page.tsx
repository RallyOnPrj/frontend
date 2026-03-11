"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getKakaoOAuthURL,
  getOAuthRedirectUri,
  loginWithOAuth,
} from "@/lib/auth";

function createFreshDummyCode(): string {
  if (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    "randomUUID" in window.crypto
  ) {
    return `fresh-${window.crypto.randomUUID().slice(0, 8)}`;
  }

  return `fresh-${Date.now().toString(36)}`;
}

function resolveDummyLoginError(message: string): string {
  if (message.includes("허용되지 않는 provider: DUMMY")) {
    return "DUMMY 로그인이 비활성화되어 있습니다. infra/.env.backend의 OAUTH_DUMMY_ENABLED와 OAUTH_ALLOWED_PROVIDERS 설정을 확인해주세요.";
  }

  return message;
}

export default function Login() {
  const router = useRouter();
  const [dummyError, setDummyError] = useState("");
  const [showDummyInput, setShowDummyInput] = useState(false);
  const [dummyCode, setDummyCode] = useState("");
  const [dummySubmitting, setDummySubmitting] = useState(false);
  const [freshDummyCode] = useState(createFreshDummyCode);
  const enableDummyLogin =
    process.env.NEXT_PUBLIC_ENABLE_DUMMY_LOGIN === "true";

  const handleKakaoLogin = () => {
    window.location.href = getKakaoOAuthURL("/");
  };

  const handleKakaoLoginWithDifferentAccount = () => {
    window.location.href = getKakaoOAuthURL("/", true);
  };

  const cancelDummyLogin = () => {
    setDummyError("");
    setDummyCode("");
    setShowDummyInput(false);
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
      const redirectUri = getOAuthRedirectUri("DUMMY");
      const result = await loginWithOAuth({
        provider: "DUMMY",
        authorizationCode: code,
        redirectUri,
      });

      if (!result.success) {
        setDummyError(
          resolveDummyLoginError(result.error || "테스트 로그인에 실패했습니다.")
        );
        return;
      }

      const userData = await getCurrentUser(result.accessToken);
      if (!userData) {
        setDummyError("사용자 정보를 가져올 수 없습니다.");
        return;
      }

      if (userData.status === "PENDING") {
        router.push("/account/profile");
        return;
      }

      const returnTo = sessionStorage.getItem("oauth_return_to");
      if (returnTo) {
        sessionStorage.removeItem("oauth_return_to");
        router.push(returnTo);
        return;
      }

      router.push("/");
    } catch (error) {
      setDummyError(
        resolveDummyLoginError(
          error instanceof Error ? error.message : "테스트 로그인에 실패했습니다."
        )
      );
    } finally {
      setDummySubmitting(false);
    }
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl justify-center px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border bg-background-secondary p-6 shadow-xl sm:p-8">
            <div className="mb-8 flex flex-col items-center justify-center gap-4">
              <img
                src="/rallyon-favicon.svg"
                alt="RallyOn Icon"
                className="h-16 w-16"
              />
              <img
                src="/rallyon-wordmark.svg"
                alt="RallyOn Wordmark"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>

            <h1 className="text-center text-2xl font-semibold text-foreground">
              로그인
            </h1>
            <p className="mt-2 text-center text-sm text-foreground-muted">
              카카오 계정으로 간편하게 시작하세요
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={handleKakaoLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-yellow-500/50 bg-[#FEE500] px-4 py-4 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-[#FDD835] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              >
                <img src="/kakaotalk.png" alt="Kakao" className="h-6 w-6" />
                카카오로 시작하기
              </button>

              <button
                type="button"
                onClick={handleKakaoLoginWithDifferentAccount}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground-muted transition-all hover:bg-foreground-muted/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                다른 계정으로 로그인
              </button>

              {enableDummyLogin && (
                <>
                  <div className="rounded-xl border border-dashed border-amber-400 bg-amber-100/80 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-amber-950">
                          테스트 계정으로 로그인
                        </div>
                        <p className="mt-1 text-xs text-amber-900/80">
                          로컬 환경에서만 쓰는 빠른 로그인입니다.
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        DEV ONLY
                      </span>
                    </div>

                    <div className="space-y-2">
                      {quickDummyAccounts.map((account) => (
                        <button
                          key={account.code}
                          type="button"
                          onClick={() => void submitDummyLogin(account.code)}
                          disabled={dummySubmitting}
                          className="w-full rounded-lg border border-amber-400 bg-amber-200 px-4 py-3 text-left text-amber-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
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
                      className="mt-3 w-full rounded-lg border border-amber-400 bg-white px-4 py-3 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-50"
                    >
                      {showDummyInput ? "직접 입력 닫기" : "직접 코드 입력"}
                    </button>
                  </div>

                  {showDummyInput && (
                    <div className="rounded-xl border border-amber-400 bg-amber-100/90 p-3">
                      <label className="block text-xs font-semibold text-amber-900">
                        AuthorizationCode
                      </label>
                      <input
                        value={dummyCode}
                        onChange={(event) => setDummyCode(event.target.value)}
                        placeholder="dummy1"
                        className="mt-2 w-full rounded-lg border border-amber-400 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        autoFocus
                      />
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => void submitDummyLogin()}
                          disabled={dummySubmitting}
                          className="flex-1 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {dummySubmitting ? "로그인 중..." : "로그인"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelDummyLogin}
                          disabled={dummySubmitting}
                          className="flex-1 rounded-lg border border-amber-400 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-200/70 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {enableDummyLogin && dummyError && (
                <p className="text-xs text-red-400">{dummyError}</p>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-foreground-muted">
              로그인 시{" "}
              <a href="/terms" className="text-primary hover:underline">
                이용약관
              </a>{" "}
              및{" "}
              <a href="/privacy" className="text-primary hover:underline">
                개인정보처리방침
              </a>
              에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
