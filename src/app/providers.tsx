"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AccountStatusResponse,
  SessionUser,
  getCurrentUser,
  logout as logoutApi,
} from "@/lib/auth";

type AuthContextValue = {
  user: SessionUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  accountStatus: AccountStatusResponse | null;
  logout: () => Promise<boolean>;
  refetch: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [accountStatus, setAccountStatus] =
    useState<AccountStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setAccountStatus(
        userData
          ? {
              status: userData.status,
              hasProfile: userData.status === "ACTIVE",
            }
          : null
      );
    } catch (error) {
      console.error("[AuthProvider] fetchUser error:", error);
      setUser(null);
      setAccountStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const success = await logoutApi();
    if (success) {
      setUser(null);
      setAccountStatus(null);
    }
    return success;
  }, []);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: !!user,
      isLoading,
      accountStatus,
      logout,
      refetch: fetchUser,
    }),
    [accountStatus, fetchUser, isLoading, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
