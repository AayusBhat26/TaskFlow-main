"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

/**
 * Optimized session hook that reduces API calls by caching session data
 * and only refetching when necessary
 */
export function useOptimizedSession() {
  const { data: session, status, update } = useSession();
  const [cachedSession, setCachedSession] = useState(session);
  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (session && status === "authenticated") {
      setCachedSession(session);
      lastFetchTime.current = Date.now();
    }
  }, [session, status]);

  // Custom update function that respects cache duration
  const optimizedUpdate = async () => {
    const now = Date.now();
    if (now - lastFetchTime.current < CACHE_DURATION) {
      // Return cached session if within cache duration
      return cachedSession;
    }

    // Only update if cache is stale
    const updatedSession = await update();
    lastFetchTime.current = now;
    return updatedSession;
  };

  return {
    data: cachedSession || session,
    status,
    update: optimizedUpdate,
  };
}
