"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AuthScreen,
  IdentitySessionState,
  createIdentitySession,
  getCurrentIdentitySession,
} from "@/lib/auth";

interface UseAuthScreenInput {
  screen: AuthScreen;
  returnTo: string;
  errorCode?: string;
}

export function useAuthScreen({
  screen,
  returnTo,
  errorCode,
}: UseAuthScreenInput) {
  const [session, setSession] = useState<IdentitySessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const hasRestartedRef = useRef(false);

  const restart = useCallback(async () => {
    const nextUrl = await createIdentitySession({ returnTo, screen });
    window.location.assign(nextUrl);
  }, [returnTo, screen]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const nextSession = await getCurrentIdentitySession();
        if (cancelled) {
          return;
        }
        setSession(nextSession);
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
      !session ||
      session.hasSession ||
      errorCode
    ) {
      return;
    }

    hasRestartedRef.current = true;
    void restart().catch(() => {
      setLoadFailed(true);
      setLoading(false);
    });
  }, [errorCode, loadFailed, loading, restart, session]);

  return {
    session,
    loading,
    loadFailed,
    effectiveReturnTo: session?.returnTo || returnTo,
    restart,
  };
}
