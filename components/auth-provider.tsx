"use client";

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const ALLOWED_EMAILS = ["stefan.cambov2000@gmail.com", "sara_kochovska@yahoo.com", "sarahkochovska@gmail.com"];

type AuthContextType = {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuthorization = (email: string | undefined) => {
    return Boolean(email && ALLOWED_EMAILS.includes(email));
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data && data.session) {
        setUser(data.session.user);
        setIsAuthorized(checkAuthorization(data.session.user.email));
      } else {
        setUser(null);
        setIsAuthorized(false);
      }

      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const authorized = checkAuthorization(session.user.email);
        setIsAuthorized(authorized);

        if (!authorized && pathname !== "/") {
          router.push("/?error=unauthorized");
        }
      } else {
        setUser(null);
        setIsAuthorized(false);

        if (pathname !== "/" && pathname !== "/auth/callback") {
          router.push("/");
        }
      }

      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthorized && pathname !== "/" && pathname !== "/auth/callback") {
        router.push("/?error=unauthorized");
      }
    }
  }, [isAuthorized, loading, pathname, router]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "/auth/callback",
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthorized, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
