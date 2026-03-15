"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser, getOAuthRedirectUri, loginWithOAuth } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [suppressUi, setSuppressUi] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setErrorMessage("로그인이 취소되었습니다.");
        return;
      }

      if (!code) {
        setStatus("error");
        setErrorMessage("인가 코드를 받지 못했습니다.");
        return;
      }

      const result = await loginWithOAuth({
        provider: "KAKAO",
        authorizationCode: code,
        redirectUri: getOAuthRedirectUri("KAKAO"),
      });

      if (!result.success) {
        setStatus("error");
        setErrorMessage(result.error || "로그인에 실패했습니다.");
        return;
      }

      const userData = await getCurrentUser();
      if (!userData) {
        setStatus("error");
        setErrorMessage("사용자 정보를 가져올 수 없습니다.");
        return;
      }

      const returnTo = sessionStorage.getItem("oauth_return_to");
      if (returnTo) {
        sessionStorage.removeItem("oauth_return_to");
      }

      if (userData.status === "PENDING") {
        setSuppressUi(true);
        router.replace("/profile/setup");
        return;
      }

      if (returnTo) {
        setStatus("success");
        setTimeout(() => {
          router.push(returnTo);
        }, 600);
        return;
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/profile");
      }, 600);
    };

    handleCallback();
  }, [router, searchParams]);

  if (suppressUi) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div className="mb-8 animate-pulse">
          <Logo className="justify-center" />
        </div>

        {status === "loading" && (
          <>
            <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-[0.3em] text-emerald-400">
              <span className="h-2 w-2 animate-pulse bg-emerald-400" />
              Authenticating
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-500">
              카카오 로그인 처리 중입니다...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-[0.3em] text-emerald-400">
              <span className="h-2 w-2 bg-emerald-400" />
              Access Granted
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-500">
              지정된 화면으로 이동합니다.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-[0.3em] text-red-400">
              <span className="h-2 w-2 bg-red-400" />
              Authentication Failed
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-500">{errorMessage}</p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-8 border-2 border-zinc-700 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-orange-500 hover:text-white"
            >
              로그인으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
