"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

interface Props {
  children: React.ReactNode;
}

interface AutosaveIndicatorContext {
  status: "unsaved" | "saved" | "pending";
  onSetStatus: (status: "unsaved" | "saved" | "pending") => void;
}

export const AutosaveIndicatorCtx =
  createContext<AutosaveIndicatorContext | null>(null);

export const AutosaveIndicatorProvider = ({ children }: Props) => {
  const [status, setStatus] = useState<"unsaved" | "saved" | "pending">(
    "saved"
  );

  const onSetStatus = useCallback((status: "unsaved" | "saved" | "pending") => {
    setStatus(status);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    status,
    onSetStatus
  }), [status, onSetStatus]);

  return (
    <AutosaveIndicatorCtx.Provider value={contextValue}>
      {children}
    </AutosaveIndicatorCtx.Provider>
  );
};

export const useAutosaveIndicator = () => {
  const ctx = useContext(AutosaveIndicatorCtx);
  if (!ctx) throw new Error("invalid use");

  return ctx;
};
