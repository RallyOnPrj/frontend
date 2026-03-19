"use client";

import { apiRequest, isApiError, API_URL } from "./api";
import { BackendGrade, toBackendGrade } from "./grade";

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "";
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "";
const DUMMY_REDIRECT_URI =
  process.env.NEXT_PUBLIC_DUMMY_REDIRECT_URI ?? "";
const isDev = process.env.NODE_ENV === "development";

export type AuthProvider = "KAKAO" | "DUMMY";
export type UserStatus = "PENDING" | "ACTIVE" | "DELETED";
export type Gender = "MALE" | "FEMALE";

export interface SessionUser {
  status: UserStatus;
  nickname?: string | null;
  profileImageUrl?: string | null;
}

export interface UserProfile {
  status: UserStatus;
  nickname?: string | null;
  tag?: string | null;
  profileImageUrl?: string | null;
  gender?: Gender | null;
  birth?: string | null;
  birthVisible?: boolean;
  regionalGrade?: BackendGrade | null;
  nationalGrade?: BackendGrade | null;
  districtName?: string | null;
  provinceName?: string | null;
  tagChangedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AccountStatusResponse {
  status: UserStatus;
  hasProfile: boolean;
}

export interface OAuthLoginRequest {
  provider: AuthProvider;
  authorizationCode: string;
  redirectUri: string;
}

export interface UserProfileCreateRequest {
  nickname: string;
  districtId: string;
  regionalGrade?: BackendGrade;
  nationalGrade?: BackendGrade;
  birth: string;
  gender: Gender;
}

export interface UserProfileUpdateRequest {
  districtId?: string;
  regionalGrade?: BackendGrade;
  nationalGrade?: BackendGrade;
  birth?: string;
  birthVisible?: boolean;
  profileImageUrl?: string;
  gender?: Gender;
}

export interface UserProfileIdentityRequest {
  nickname?: string;
  tag?: string;
}

export interface ProfilePrefillResponse {
  suggestedNickname?: string | null;
  hasOauthNickname?: boolean;
}

export interface Province {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
}

interface UserProfileCreateResponse {
  userId: string;
}

function debugLog(...args: unknown[]) {
  if (isDev) {
    console.log(...args);
  }
}

function getRedirectUriByProvider(provider: AuthProvider) {
  const redirectUri =
    provider === "KAKAO" ? KAKAO_REDIRECT_URI : DUMMY_REDIRECT_URI;

  if (!redirectUri) {
    throw new Error(
      `${provider} redirect URI is not configured. NEXT_PUBLIC_${provider}_REDIRECT_URI를 확인해주세요.`
    );
  }

  if (
    !redirectUri.startsWith("http://") &&
    !redirectUri.startsWith("https://")
  ) {
    throw new Error(
      `Invalid redirect URI format: ${redirectUri}. Must start with http:// or https://`
    );
  }

  return redirectUri;
}

function toFriendlyError(error: unknown, fallback: string) {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function getKakaoOAuthURL(
  returnTo?: string,
  forceLogin = false
): string {
  if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
    throw new Error(
      "Kakao OAuth 설정이 누락되었습니다. NEXT_PUBLIC_KAKAO_CLIENT_ID와 NEXT_PUBLIC_KAKAO_REDIRECT_URI를 확인해주세요."
    );
  }

  if (returnTo && typeof window !== "undefined") {
    sessionStorage.setItem("oauth_return_to", returnTo);
  }

  const qs = new URLSearchParams({
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
    response_type: "code",
    ...(forceLogin ? { prompt: "login" } : {}),
  });

  return `https://kauth.kakao.com/oauth/authorize?${qs.toString()}`;
}

export function getOAuthRedirectUri(provider: AuthProvider) {
  const redirectUri = getRedirectUriByProvider(provider);
  debugLog(`[Auth] Redirect URI for ${provider}:`, redirectUri);
  return redirectUri;
}

export async function loginWithOAuth(
  input: OAuthLoginRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest("/auth/login", {
      method: "POST",
      body: input,
      parseAs: "void",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toFriendlyError(error, "로그인에 실패했습니다."),
    };
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    return await apiRequest<SessionUser>("/users/me", {
      method: "GET",
      auth: true,
    });
  } catch (error) {
    if (isApiError(error) && [401, 403].includes(error.status)) {
      return null;
    }

    debugLog("[Auth] getCurrentUser failed:", error);
    return null;
  }
}

export async function getMyProfile(): Promise<UserProfile | null> {
  try {
    return await apiRequest<UserProfile>("/users/me/profile", {
      method: "GET",
      auth: true,
    });
  } catch (error) {
    if (isApiError(error) && [401, 403, 404].includes(error.status)) {
      return null;
    }

    throw error;
  }
}

export async function createUserProfile(
  payload: UserProfileCreateRequest
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const response = await apiRequest<UserProfileCreateResponse>(
      "/users/me/profile",
      {
        method: "POST",
        auth: true,
        body: payload,
      }
    );

    return { success: true, userId: response.userId };
  } catch (error) {
    return {
      success: false,
      error: toFriendlyError(error, "프로필 저장에 실패했습니다."),
    };
  }
}

export async function updateUserProfile(
  payload: UserProfileUpdateRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest("/users/me/profile", {
      method: "PATCH",
      auth: true,
      body: payload,
      parseAs: "void",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toFriendlyError(error, "프로필 수정에 실패했습니다."),
    };
  }
}

export async function updateProfileIdentity(
  payload: UserProfileIdentityRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest("/users/me/profile/identity", {
      method: "PATCH",
      auth: true,
      body: payload,
      parseAs: "void",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toFriendlyError(error, "닉네임 저장에 실패했습니다."),
    };
  }
}

export async function getProfilePrefill(): Promise<ProfilePrefillResponse | null> {
  try {
    return await apiRequest<ProfilePrefillResponse>("/users/me/profile/prefill", {
      method: "GET",
      auth: true,
    });
  } catch (error) {
    if (isApiError(error) && [401, 404].includes(error.status)) {
      return null;
    }

    return null;
  }
}

export async function getProvinces(): Promise<Province[]> {
  try {
    return await apiRequest<Province[]>("/regions/provinces", {
      method: "GET",
    });
  } catch (error) {
    debugLog("[Auth] getProvinces failed:", error);
    return [];
  }
}

export async function getDistricts(
  provinceId: string,
  signal?: AbortSignal
): Promise<District[]> {
  try {
    return await apiRequest<District[]>(`/regions/${provinceId}/districts`, {
      method: "GET",
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    debugLog("[Auth] getDistricts failed:", error);
    return [];
  }
}

export async function logout(): Promise<boolean> {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
      parseAs: "void",
    });
    return true;
  } catch (error) {
    debugLog("[Auth] logout failed:", error);
    return true;
  }
}

export async function deleteAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  return {
    success: false,
    error: "회원 탈퇴 기능이 아직 준비되지 않았습니다.",
  };
}

export function formatBirthDateForInput(birth?: string | null) {
  if (!birth) {
    return "";
  }

  const value = birth.includes("T") ? birth.slice(0, 10) : birth;
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }

  return value;
}

export function toCompactBirthDate(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function buildCreateProfilePayload(input: {
  nickname: string;
  districtId: string;
  regionalGrade?: string;
  nationalGrade?: string;
  birth: string;
  gender: Gender;
}): UserProfileCreateRequest {
  return {
    nickname: input.nickname.trim(),
    districtId: input.districtId,
    regionalGrade: toBackendGrade(input.regionalGrade),
    nationalGrade: toBackendGrade(input.nationalGrade),
    birth: toCompactBirthDate(input.birth),
    gender: input.gender,
  };
}

export function buildUpdateProfilePayload(input: {
  districtId?: string;
  regionalGrade?: string;
  nationalGrade?: string;
  birth?: string;
  gender?: Gender;
  birthVisible?: boolean;
  profileImageUrl?: string;
}): UserProfileUpdateRequest {
  return {
    ...(input.districtId ? { districtId: input.districtId } : {}),
    ...(input.regionalGrade
      ? { regionalGrade: toBackendGrade(input.regionalGrade) }
      : {}),
    ...(input.nationalGrade
      ? { nationalGrade: toBackendGrade(input.nationalGrade) }
      : {}),
    ...(input.birth ? { birth: toCompactBirthDate(input.birth) } : {}),
    ...(input.gender ? { gender: input.gender } : {}),
    ...(typeof input.birthVisible === "boolean"
      ? { birthVisible: input.birthVisible }
      : {}),
    ...(input.profileImageUrl
      ? { profileImageUrl: input.profileImageUrl }
      : {}),
  };
}

export { API_URL };
