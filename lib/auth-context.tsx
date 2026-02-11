"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const protectedPaths = ["/dashboard", "/tutor", "/admin"];
    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path),
    );

    if (isProtectedPath && !loading && !user) {
      refreshUser();
    }
  }, [pathname, loading, user, refreshUser]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth-sync") {
        refreshUser();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshUser]);

  const value = {
    user,
    loading,
    refreshUser,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth(redirectUrl = "/login") {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [loading, isAuthenticated, router, redirectUrl]);

  return { user, loading, isAuthenticated };
}

export function useRequireRole(
  allowedRoles: UserRole[],
  redirectUrl = "/dashboard",
) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role)) {
        router.push(redirectUrl);
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, redirectUrl]);

  return { user, loading, isAuthenticated };
}
