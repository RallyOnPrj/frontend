"use client";

import { AuthScreen } from "@/lib/auth";

const COMMON_ERROR_MESSAGES: Record<string, string> = {
  social_login_failed: "소셜 로그인 연결에 실패했어요. 잠시 후 다시 시도해주세요.",
  invalid_social_callback:
    "소셜 로그인 응답을 확인하지 못했어요. 다시 시도해주세요.",
  authorization_failed: "인증 연결이 끊겼어요. 다시 시작해주세요.",
  token_exchange_failed:
    "인증 연결을 마무리하지 못했어요. 잠시 후 다시 시도해주세요.",
  invalid_authorization_state:
    "인증 준비 상태가 만료되었어요. 다시 시작해주세요.",
};

const SCREEN_SPECIFIC_ERROR_MESSAGES: Record<
  AuthScreen,
  Record<string, string>
> = {
  login: {
    local_login_failed: "이메일 또는 비밀번호가 올바르지 않습니다.",
    login_session_expired:
      "로그인 세션이 만료되었어요. 다시 시작한 뒤 로그인해주세요.",
  },
  signup: {
    duplicate_email:
      "이미 가입된 이메일입니다. 로그인하거나 다른 이메일을 사용해주세요.",
    invalid_password: "비밀번호는 8자 이상이어야 합니다.",
    password_mismatch: "비밀번호 확인이 일치하지 않습니다.",
    signup_session_expired:
      "회원가입 준비 상태가 만료되었어요. 다시 시작해주세요.",
    local_login_failed:
      "가입 후 로그인 처리에 실패했어요. 잠시 후 다시 시도해주세요.",
  },
};

const FALLBACK_ERROR_MESSAGE: Record<AuthScreen, string> = {
  login: "로그인에 실패했어요. 잠시 후 다시 시도해주세요.",
  signup: "회원가입에 실패했어요. 잠시 후 다시 시도해주세요.",
};

export function resolveAuthErrorMessage(
  screen: AuthScreen,
  errorCode?: string
) {
  if (!errorCode) {
    return null;
  }

  return (
    SCREEN_SPECIFIC_ERROR_MESSAGES[screen][errorCode] ||
    COMMON_ERROR_MESSAGES[errorCode] ||
    FALLBACK_ERROR_MESSAGE[screen]
  );
}

export function getAuthLoadFailureMessage() {
  return "네트워크 상태를 확인한 뒤 다시 시도해주세요. 문제가 계속되면 인증 흐름을 새로 시작할 수 있습니다.";
}
