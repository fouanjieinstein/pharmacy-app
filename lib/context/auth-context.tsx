"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// Authentication is now backed by a real server session (httpOnly cookie +
// database-backed session record). This context is only a client-side cache of
// "who am I?" for rendering — it is never the source of truth for
// authorisation. Every protected route and API handler re-checks the session
// server-side; see lib/server/session.ts.

export type UserRole = "CUSTOMER" | "PHARMACIST" | "ADMIN" | "SUPER_ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerifiedAt: string | null;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  fields?: Record<string, string>;
}

interface AuthContextValue {
  user: SessionUser | null;
  /** True until the initial session lookup resolves. */
  loading: boolean;
  isSignedIn: boolean;
  isEmailVerified: boolean;
  register: (input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthResult & { emailVerificationSent?: boolean }>;
  login: (input: { email: string; password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  verifyEmail: (code: string) => Promise<AuthResult>;
  resendVerification: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  /** Server-rendered session, so the first paint already knows who you are. */
  initialUser?: SessionUser | null;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const [loading, setLoading] = useState(initialUser === null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If the server already resolved a user we trust that for first paint;
    // otherwise confirm with the server (the cookie may exist from a prior visit).
    if (initialUser) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [initialUser, refresh]);

  const register: AuthContextValue["register"] = async (input) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Sign-up failed.", fields: data.fields };
    setUser(data.user);
    return { ok: true, emailVerificationSent: Boolean(data.emailVerificationSent) };
  };

  const login: AuthContextValue["login"] = async (input) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Sign-in failed.", fields: data.fields };
    setUser(data.user);
    return { ok: true };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const verifyEmail: AuthContextValue["verifyEmail"] = async (code) => {
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Verification failed." };
    setUser((u) => (u ? { ...u, emailVerifiedAt: new Date().toISOString() } : u));
    return { ok: true };
  };

  const resendVerification: AuthContextValue["resendVerification"] = async () => {
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Couldn't resend the code." };
    return { ok: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSignedIn: user !== null,
        isEmailVerified: user?.emailVerifiedAt != null,
        register,
        login,
        logout,
        refresh,
        verifyEmail,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * For components rendered only inside an authenticated route tree (e.g. under
 * /account, whose server layout redirects signed-out visitors). Narrows `user`
 * to non-null so callers don't need redundant guards.
 */
export function useAuthUser(): SessionUser {
  const { user } = useAuth();
  if (!user) {
    throw new Error(
      "useAuthUser called outside an authenticated route. Use useAuth() and handle the signed-out case."
    );
  }
  return user;
}
