"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getKakaoOAuthURL,
  getOAuthRedirectUri,
  loginWithOAuth,
} from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [dummyError, setDummyError] = useState("");
  const [showDummyInput, setShowDummyInput] = useState(false);
  const [dummyCode, setDummyCode] = useState("");
  const [dummySubmitting, setDummySubmitting] = useState(false);
  const enableDummyLogin =
    process.env.NEXT_PUBLIC_ENABLE_DUMMY_LOGIN === "true";

  const handleKakaoLogin = () => {
    // 기본 로그인 (기존 세션 사용)
    window.location.href = getKakaoOAuthURL("/");
  };

  const handleKakaoLoginWithDifferentAccount = () => {
    // 다른 계정으로 로그인 (매번 로그인 화면 표시)
    window.location.href = getKakaoOAuthURL("/", true);
  };

  const handleDummyLogin = async () => {
    setShowDummyInput(true);
  };

  const submitDummyLogin = async () => {
    setDummyError("");
    const code = dummyCode.trim();
    if (!code) {
      setDummyError("AuthorizationCode를 입력해 주세요.");
      return;
    }

    setDummySubmitting(true);
    const redirectUri = getOAuthRedirectUri("DUMMY");
    const result = await loginWithOAuth({
      provider: "DUMMY",
      authorizationCode: code,
      redirectUri,
    });

    if (!result.success) {
      setDummyError(result.error || "테스트 로그인에 실패했습니다.");
      setDummySubmitting(false);
      return;
    }

    const userData = await getCurrentUser(result.accessToken);
    if (!userData) {
      setDummyError("사용자 정보를 가져올 수 없습니다.");
      setDummySubmitting(false);
      return;
    }

    if (userData.status === "PENDING") {
      setDummySubmitting(false);
      router.push("/account/profile");
      return;
    }

    const returnTo = sessionStorage.getItem("oauth_return_to");
    if (returnTo) {
      sessionStorage.removeItem("oauth_return_to");
      setDummySubmitting(false);
      router.push(returnTo);
      return;
    }

    setDummySubmitting(false);
    router.push("/");
  };

  const cancelDummyLogin = () => {
    setDummyError("");
    setDummyCode("");
    setShowDummyInput(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl justify-center px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border bg-background-secondary p-6 shadow-xl sm:p-8">
            {/* 로고 */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4">
              <img
                src="/drive-favicon.svg"
                alt="Drive Icon"
                className="h-16 w-16"
              />
              <img
                src="/drive-wordmark.svg"
                alt="Drive Wordmark"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>

            {/* 타이틀 */}
            <h1 className="text-center text-2xl font-semibold text-foreground">
              로그인
            </h1>
            <p className="mt-2 text-center text-sm text-foreground-muted">
              카카오 계정으로 간편하게 시작하세요
            </p>

            {/* 카카오 로그인 버튼 */}
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
                  <button
                    type="button"
                    onClick={handleDummyLogin}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-amber-400 bg-amber-200 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm transition-all hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                  >
                    <span>테스트 계정으로 로그인 (local)</span>
                    <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      DEV ONLY
                    </span>
                  </button>

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
                          onClick={submitDummyLogin}
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

            {/* 안내 문구 */}
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
