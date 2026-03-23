"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  getLoginContext,
  LoginContext,
  startIdentitySession,
} from "@/lib/auth";

const ERROR_MESSAGES: Record<string, string> = {
  social_login_failed: "소셜 로그인에 실패했습니다. 다시 시도해주세요.",
  invalid_social_callback: "소셜 로그인 응답을 확인하지 못했습니다. 다시 시도해주세요.",
  authorization_failed: "인가 처리에 실패했습니다. 다시 로그인해주세요.",
  invalid_authorization_state: "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
};

interface LoginPageClientProps {
  returnTo: string;
  errorCode?: string;
}

function resolveErrorMessage(errorCode?: string) {
  if (!errorCode) {
    return null;
  }

  return (
    ERROR_MESSAGES[errorCode] ||
    "로그인에 실패했습니다. 잠시 후 다시 시도해주세요."
  );
}

export default function LoginPageClient({
  returnTo,
  errorCode,
}: LoginPageClientProps) {
  const [loginContext, setLoginContext] = useState<LoginContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const hasRestartedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const context = await getLoginContext();
        if (cancelled) {
          return;
        }
        setLoginContext(context);
        setLoadFailed(false);
      } catch {
        if (cancelled) {
          return;
        }
        setLoadFailed(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      loading ||
      loadFailed ||
      hasRestartedRef.current ||
      !loginContext ||
      loginContext.hasSession ||
      errorCode
    ) {
      return;
    }

    hasRestartedRef.current = true;
    startIdentitySession({ returnTo });
  }, [errorCode, loadFailed, loading, loginContext, returnTo]);

  const effectiveReturnTo = loginContext?.returnTo || returnTo;
  const errorMessage = resolveErrorMessage(errorCode);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 border border-zinc-800 bg-zinc-900/95 px-8 py-10 text-center shadow-2xl">
          <LoaderCircle className="h-8 w-8 animate-spin text-emerald-400" />
          <div className="space-y-2">
            <p className="font-display text-2xl font-bold uppercase tracking-tight text-white">
              로그인 세션 확인 중
            </p>
            <p className="text-sm leading-relaxed text-zinc-400">
              인증 서버가 로그인 상태를 준비하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 w-full max-w-md border border-red-500/30 bg-zinc-900/95 px-8 py-10 text-center shadow-2xl">
          <div className="mb-6 flex justify-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            인증 화면을 불러오지 못했습니다
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            잠시 후 다시 시도하거나 로그인 세션을 다시 시작해주세요.
          </p>
          <Button
            onClick={() => startIdentitySession({ returnTo })}
            className="mt-8 h-12 w-full rounded-none bg-emerald-400 text-base font-bold text-zinc-950 hover:bg-emerald-300"
          >
            로그인 다시 시작
          </Button>
        </div>
      </div>
    );
  }

  if (!loginContext?.hasSession) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative z-10 w-full max-w-md border border-zinc-800 bg-zinc-900/95 px-8 py-10 text-center shadow-2xl">
          <p className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            로그인 세션을 다시 시작해주세요
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {errorMessage || "로그인 준비 상태가 만료되었습니다."}
          </p>
          <Button
            onClick={() => startIdentitySession({ returnTo })}
            className="mt-8 h-12 w-full rounded-none bg-emerald-400 text-base font-bold text-zinc-950 hover:bg-emerald-300"
          >
            다시 로그인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden border border-zinc-800 bg-zinc-900/95 shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between border-b border-zinc-800 p-8 lg:border-r lg:border-b-0 lg:p-12">
          <div>
            <Logo variant="dark" className="h-8" />
            <p className="mt-10 font-mono text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              Authorization Server
            </p>
            <h1 className="mt-4 font-display text-4xl font-black uppercase leading-none tracking-tight text-white md:text-5xl">
              RallyOn
              <br />
              Login
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-zinc-400">
              인증 화면은 `auth.rallyon.test`가 직접 소유하고, 로그인 완료 후
              기존 제품 화면으로 돌아갑니다.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                Return To
              </p>
              <p className="mt-2 text-sm text-white">{effectiveReturnTo}</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className="h-px flex-1 bg-zinc-800" />
              토큰은 HttpOnly 쿠키로만 관리됩니다
              <span className="h-px flex-1 bg-zinc-800" />
            </div>
          </div>
        </section>

        <section className="p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-zinc-500">
              Sign In
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-white">
              계정에 로그인
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              이메일 로그인 또는 연결된 소셜 계정으로 계속 진행할 수 있습니다.
            </p>

            {errorMessage ? (
              <div className="mt-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {errorMessage}
              </div>
            ) : null}

            <form
              method="post"
              action="/identity/local/login"
              className="mt-8 space-y-4"
            >
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@rallyon.test"
                  className="h-12 w-full rounded-none border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none transition focus:border-emerald-400"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="비밀번호"
                  className="h-12 w-full rounded-none border border-zinc-700 bg-zinc-950 px-4 text-sm text-white outline-none transition focus:border-emerald-400"
                />
              </label>
              <Button
                type="submit"
                className="h-12 w-full rounded-none bg-emerald-400 text-base font-bold text-zinc-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.06)] transition hover:bg-emerald-300 active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                이메일 로그인
              </Button>
            </form>

            <div className="mt-8 space-y-3">
              {loginContext.allowedProviders.includes("KAKAO") ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-none border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-800 hover:text-white"
                >
                  <a href="/identity/social/start/KAKAO">카카오 로그인</a>
                </Button>
              ) : null}
              {loginContext.allowedProviders.includes("GOOGLE") ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-none border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-800 hover:text-white"
                >
                  <a href="/identity/social/start/GOOGLE">구글 로그인</a>
                </Button>
              ) : null}
            </div>

            {loginContext.dummyOptions.length > 0 ? (
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Local Test Login
                </p>
                <div className="mt-4 space-y-3">
                  {loginContext.dummyOptions.map((option) => (
                    <Button
                      key={option.startUrl}
                      asChild
                      variant="ghost"
                      className="h-12 w-full justify-between rounded-none border border-zinc-800 bg-zinc-950 px-4 text-left text-white hover:bg-zinc-800 hover:text-white"
                    >
                      <a href={option.startUrl}>
                        <span>{option.label}</span>
                        <ArrowRight className="h-4 w-4 text-emerald-400" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            <Link
              href={effectiveReturnTo === "/profile" ? "/" : effectiveReturnTo}
              className="mt-8 inline-flex text-xs font-mono font-bold uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-white"
            >
              돌아가기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
