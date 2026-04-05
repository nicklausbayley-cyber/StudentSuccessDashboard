import React, { createContext, useContext, useMemo, useState } from "react";
import { apiFetch } from "./api";

type UserClaims = {
  sub?: string;
  district_id?: number;
  role?: string;
  exp?: number;
};

type AuthCtx = {
  token: string | null;
  claims: UserClaims | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  setTokenFromSSO: (token: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

function parseJwt(token: string): UserClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(claims: UserClaims | null): boolean {
  if (!claims?.exp) return false;
  return Date.now() >= claims.exp * 1000;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("token");
    if (!stored) return null;
    const claims = parseJwt(stored);
    if (isTokenExpired(claims)) {
      localStorage.removeItem("token");
      return null;
    }
    return stored;
  });

  const claims = useMemo(() => (token ? parseJwt(token) : null), [token]);
  const role = claims?.role ?? null;
  const isAuthenticated = !!token && !isTokenExpired(claims);

  const login = async (email: string, password: string) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const t = data?.access_token as string | undefined;
    if (!t) throw new Error("Login did not return access_token");
    localStorage.setItem("token", t);
    setToken(t);
  };

  const setTokenFromSSO = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, claims, isAuthenticated, role, login, setTokenFromSSO, logout }),
    [token, claims, isAuthenticated, role]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
