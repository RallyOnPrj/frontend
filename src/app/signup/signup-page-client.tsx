"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  AuthFailureState,
  AuthLoadingState,
  AuthPageScene,
} from "@/components/auth/AuthPageScene";
import {
  getLoginContext,
  LoginContext,
  startIdentitySession,
} from "@/lib/auth";

const ERROR_MESSAGES: Record<string, string> = {
  social_login_failed: "소셜 로그인 연결에 실패했어요. 잠시 후 다시 시도해주세요.",
  invalid_social_callback:
    "소셜 로그인 응답을 확인하지 못했어요. 다시 시도해주세요.",
  authorization_failed: "인증 연결이 끊겼어요. 다시 시작해주세요.",
  token_exchange_failed:
    "인증 연결을 마무리하지 못했어요. 잠시 후 다시 시도해주세요.",
  invalid_authorization_state:
    "회원가입 준비 상태가 만료되었어요. 다시 시작해주세요.",
  duplicate_email:
    "이미 가입된 이메일입니다. 로그인하거나 다른 이메일을 사용해주세요.",
  invalid_password: "비밀번호는 8자 이상이어야 합니다.",
  password_mismatch: "비밀번호 확인이 일치하지 않습니다.",
  signup_session_expired:
    "회원가입 준비 상태가 만료되었어요. 다시 시작해주세요.",
  local_login_failed:
    "가입 후 로그인 처리에 실패했어요. 잠시 후 다시 시도해주세요.",
};

interface SignupPageClientProps {
  returnTo: string;
  errorCode?: string;
}

function resolveErrorMessage(errorCode?: string) {
  if (!errorCode) {
    return null;
  }

  return (
    ERROR_MESSAGES[errorCode] ||
    "회원가입에 실패했어요. 잠시 후 다시 시도해주세요."
  );
}

export default function SignupPageClient({
  returnTo,
  errorCode,
}: SignupPageClientProps) {
  const [loginContext, setLoginContext] = useState<LoginContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationError, setValidationError] = useState("");
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
    startIdentitySession({ returnTo, screen: "signup" });
  }, [errorCode, loadFailed, loading, loginContext, returnTo]);

  const serverErrorMessage = resolveErrorMessage(errorCode);
  const errorMessage = validationError || serverErrorMessage;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (password.length < 8) {
      event.preventDefault();
      setValidationError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      event.preventDefault();
      setValidationError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setValidationError("");
  }

  if (loading) {
    return <AuthLoadingState />;
  }

  if (loadFailed) {
    return (
      <AuthFailureState
        returnTo={returnTo}
        screen="signup"
        message="네트워크 상태를 확인한 뒤 다시 시도해주세요. 문제가 계속되면 인증 흐름을 새로 시작할 수 있습니다."
      />
    );
  }

  if (!loginContext?.hasSession) {
    if (!errorMessage) {
      return <AuthLoadingState />;
    }

    return (
      <AuthFailureState
        returnTo={returnTo}
        screen="signup"
        message={errorMessage}
      />
    );
  }

  return (
    <AuthPageScene
      eyebrow="Signup"
      title="RallyOn 회원가입"
      description="이메일 계정을 만들고 바로 프로필 설정까지 이어서 완료하세요."
      errorMessage={errorMessage}
      socialLabel="Social Start"
      allowedProviders={loginContext.allowedProviders}
      dummyOptions={loginContext.dummyOptions}
      form={
        <form
          method="post"
          action="/identity/local/register"
          className="space-y-3"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="returnTo" value={returnTo} />
          <label className="block space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-zinc-500">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setValidationError("");
              }}
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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setValidationError("");
              }}
              placeholder="8자 이상 비밀번호"
              className="h-12 w-full rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-zinc-500">
              Confirm Password
            </span>
            <input
              type="password"
              name="passwordConfirm"
              required
              minLength={8}
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                setValidationError("");
              }}
              placeholder="비밀번호를 다시 입력하세요"
              className="h-12 w-full rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </label>
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-none bg-orange-500 text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.12)] transition hover:bg-orange-400"
          >
            회원가입
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>
      }
      footer={
        <p className="text-sm font-medium text-zinc-600">
          이미 계정이 있으신가요?{" "}
          <a
            href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
            className="font-semibold text-emerald-600 underline-offset-4 hover:underline"
          >
            로그인
          </a>
        </p>
      }
    />
  );
}
