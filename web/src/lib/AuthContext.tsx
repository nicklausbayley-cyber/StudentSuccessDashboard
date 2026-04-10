import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";

type UserClaims = {
  sub?: string;
  district_id?: number;
  role?: string;
  exp?: number;
};

type CurrentUser = {
  id: number;
  email: string;
  role: string;
  district_id: number;
  school_id: number | null;
  auth_provider: string | null;
  is_active: boolean;
};

type AuthCtx = {
  token: string | null;
  claims: UserClaims | null;
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  setTokenFromSSO: (token: string) => void;
  refreshMe: () => Promise<void>;
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

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const claims = useMemo(() => (token ? parseJwt(token) : null), [token]);
  const role = currentUser?.role ?? claims?.role ?? null;
  const isAuthenticated = !!token && !isTokenExpired(claims);

  const refreshMe = async () => {
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const data = await apiFetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(data as CurrentUser);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    if (token) {
      void refreshMe();
    } else {
      setCurrentUser(null);
    }
  }, [token]);

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
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      claims,
      currentUser,
      isAuthenticated,
      role,
      login,
      setTokenFromSSO,
      refreshMe,
      logout,
    }),
    [token, claims, currentUser, isAuthenticated, role]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
