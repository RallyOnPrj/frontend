"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AccountStatusResponse,
  SessionUser,
  getCurrentUser,
  logout as logoutApi,
} from "@/lib/auth";

export function useAuth() {
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
      console.error("[useAuth] fetchUser error:", error);
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

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    accountStatus,
    logout,
    refetch: fetchUser,
  };
}
