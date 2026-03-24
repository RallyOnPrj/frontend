"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  LoaderCircle,
  Newspaper,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  AuthProvider,
  getLoginContext,
  LoginContext,
  startIdentitySession,
} from "@/lib/auth";

const ERROR_MESSAGES: Record<string, string> = {
  social_login_failed: "소셜 로그인 연결에 실패했어요. 잠시 후 다시 시도해주세요.",
  invalid_social_callback:
    "소셜 로그인 응답을 확인하지 못했어요. 다시 시도해주세요.",
  authorization_failed: "로그인 연결이 끊겼어요. 다시 로그인해주세요.",
  invalid_authorization_state:
    "로그인 준비 상태가 만료되었어요. 다시 시작해주세요.",
};

interface LoginPageClientProps {
  returnTo: string;
  errorCode?: string;
}

const SERVICE_HIGHLIGHTS = [
  {
    icon: Activity,
    title: "게임 생성과 코트 운영",
    description: "대진 배정과 진행 흐름을 한 화면에서 간결하게 정리합니다.",
  },
  {
    icon: Users,
    title: "참가자 합류와 플레이 연결",
    description: "참가자 추가부터 경기 흐름까지 자연스럽게 이어집니다.",
  },
  {
    icon: Newspaper,
    title: "프로필과 배드민턴 소식",
    description: "내 정보와 배드민턴 허브 소식을 같은 서비스 안에서 확인합니다.",
  },
] as const;

function resolveErrorMessage(errorCode?: string) {
  if (!errorCode) {
    return null;
  }

  return (
    ERROR_MESSAGES[errorCode] ||
    "로그인에 실패했어요. 잠시 후 다시 시도해주세요."
  );
}

function SocialLoginButton({
  provider,
  href,
}: {
  provider: Exclude<AuthProvider, "DUMMY">;
  href: string;
}) {
  const config = {
    KAKAO: {
      label: "카카오 로그인",
      iconSrc: "/social/kakao-symbol.svg",
      iconClassName: "h-[18px] w-[18px]",
      iconSize: 18,
      buttonClassName:
        "border border-[#e2c400] bg-[#FEE500] text-[#191919] hover:bg-[#f7df00]",
    },
    GOOGLE: {
      label: "Google로 로그인",
      iconSrc: "/social/google-g.svg",
      iconClassName: "h-[18px] w-[18px]",
      iconSize: 18,
      buttonClassName:
        "border border-[#dadce0] bg-white text-[#1f1f1f] hover:bg-[#f8f9fa]",
    },
    APPLE: {
      label: "Apple로 로그인",
      iconSrc: "/social/apple-logo.svg",
      iconClassName: "h-6 w-6",
      iconSize: 24,
      buttonClassName:
        "border border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800",
    },
  }[provider];

  return (
    <a
      href={href}
      className={`flex h-12 w-full items-center justify-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors ${config.buttonClassName}`}
    >
      <Image
        src={config.iconSrc}
        alt=""
        aria-hidden="true"
        width={config.iconSize}
        height={config.iconSize}
        className={config.iconClassName}
      />
      <span>{config.label}</span>
    </a>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-md border-2 border-zinc-800 bg-zinc-950/95 p-7 text-center shadow-[8px_8px_0px_0px_rgba(16,185,129,0.18)]">
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-emerald-400" />
        <p className="mt-5 text-[10px] font-mono font-bold uppercase tracking-[0.34em] text-emerald-400">
          Preparing Login
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-white">
          RallyOn에 연결 중
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          코트 운영과 플레이 흐름을 이어갈 수 있도록 로그인 준비를 마치고
          있습니다.
        </p>
      </div>
    </div>
  );
}

function FailureState({
  returnTo,
  message,
}: {
  returnTo: string;
  message: string;
}) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-md border-2 border-red-500/40 bg-zinc-950/95 p-7 text-center shadow-[8px_8px_0px_0px_rgba(239,68,68,0.18)]">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-400" />
        <p className="mt-5 text-[10px] font-mono font-bold uppercase tracking-[0.34em] text-red-300">
          Login Error
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-white">
          로그인 화면을 불러오지 못했어요
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{message}</p>
        <Button
          onClick={() => startIdentitySession({ returnTo })}
          className="mt-7 h-12 w-full rounded-none bg-orange-500 text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 hover:bg-orange-400"
        >
          로그인 다시 시작
        </Button>
      </div>
    </div>
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

  const errorMessage = resolveErrorMessage(errorCode);

  if (loading) {
    return <LoadingState />;
  }

  if (loadFailed) {
    return (
      <FailureState
        returnTo={returnTo}
        message="네트워크 상태를 확인한 뒤 다시 시도해주세요. 문제가 계속되면 로그인 흐름을 새로 시작할 수 있습니다."
      />
    );
  }

  if (!loginContext?.hasSession) {
    if (!errorMessage) {
      return <LoadingState />;
    }

    return <FailureState returnTo={returnTo} message={errorMessage} />;
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl items-center px-4 py-4 md:px-6">
        <div className="grid w-full gap-4 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)_auto]">
          <section className="border-2 border-zinc-800 bg-zinc-950/88 p-5 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.12)] sm:p-6 lg:row-start-1 lg:h-full lg:p-7">
            <div className="flex h-full flex-col">
              <Logo variant="dark" className="h-8" />

              <div className="mt-6 flex-1">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.32em] text-emerald-400">
                  <div className="h-px w-8 bg-emerald-400" />
                  Welcome Back
                </div>
                <h1 className="font-display text-4xl leading-[0.95] font-black tracking-tight text-white sm:text-5xl">
                  게임 생성부터
                  <br />
                  코트 운영,
                  <br />
                  플레이 흐름까지
                </h1>
                <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-zinc-400">
                  RallyOn은 게임 생성, 참가자 합류, 프로필, 배드민턴 소식까지
                  코트 안팎의 흐름을 한 서비스 안에서 자연스럽게 연결합니다.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {SERVICE_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    className="border border-emerald-500/20 bg-emerald-500/6 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center border border-emerald-500/30 bg-zinc-950 text-emerald-300">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-2 border-zinc-900 bg-white text-zinc-950 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.9)] lg:row-start-1 lg:h-full lg:overflow-y-auto">
            <div className="flex h-full min-h-0 flex-col justify-center p-5 sm:p-6 lg:p-7">
              <div className="lg:hidden">
                <Logo className="h-7" variant="light" />
              </div>

              <p className="mt-3 text-[10px] font-mono font-bold uppercase tracking-[0.32em] text-emerald-600">
                Login
              </p>
              <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-zinc-950 sm:text-4xl">
                RallyOn 로그인
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-zinc-600">
                계정을 연결하고 코트 운영과 플레이 흐름을 이어서 사용하세요.
              </p>

              {errorMessage ? (
                <div className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <form
                method="post"
                action="/identity/local/login"
                className="mt-5 space-y-3"
              >
                <label className="block space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-zinc-500">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@rallyon.com"
                    className="h-12 w-full rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-zinc-500">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="비밀번호"
                    className="h-12 w-full rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </label>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full rounded-none bg-orange-500 text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.12)] hover:bg-orange-400"
                >
                  로그인
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-zinc-200" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-zinc-400">
                  Social Login
                </span>
                <span className="h-px flex-1 bg-zinc-200" />
              </div>

              <div className="space-y-2.5">
                <SocialLoginButton
                  provider="KAKAO"
                  href="/identity/social/start/KAKAO"
                />
                <SocialLoginButton
                  provider="GOOGLE"
                  href="/identity/social/start/GOOGLE"
                />
                <SocialLoginButton
                  provider="APPLE"
                  href="/identity/social/start/APPLE"
                />
              </div>
            </div>
          </section>

          {loginContext.dummyOptions.length > 0 ? (
            <section className="border border-dashed border-zinc-700/70 bg-zinc-950/72 p-4 text-zinc-100 lg:col-start-2 lg:row-start-2">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-zinc-400">
                Local Test Login
              </p>
              <p className="mt-2 text-xs leading-6 text-zinc-400">
                개발/테스트 환경 전용 빠른 로그인입니다.
              </p>
              <div className="mt-3 space-y-2">
                {loginContext.dummyOptions.map((option) => (
                  <Button
                    key={option.startUrl}
                    asChild
                    variant="outline"
                    className="h-10 w-full justify-between rounded-none border border-zinc-700 bg-zinc-900 px-3 text-left text-sm text-white hover:bg-zinc-800"
                  >
                    <a href={option.startUrl}>
                      <span>{option.label}</span>
                      <ArrowRight className="h-4 w-4 text-emerald-400" />
                    </a>
                  </Button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
