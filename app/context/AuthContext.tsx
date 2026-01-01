"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAppDispatch } from "@/store/hooks";
import {
  setUser as setReduxUser,
  clearUser as clearReduxUser,
  syncUserIdentity,
} from "@/store/features/user/userSlice";
import {
  signInWithGoogle as reduxSignInWithGoogle,
  loginWithEmail as reduxLoginWithEmail,
  signUpWithEmail as reduxSignUpWithEmail,
  signOutUser as reduxSignOutUser,
} from "@/store/features/auth/authSlice";
import Toast, { ToastType } from "../components/shared/Toast";

interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  userType: "traveller" | "manager" | "admin" | "support" | null;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    pass: string,
    metadata?: any
  ) => Promise<void>;
  showToast: (message: string, type?: ToastType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({
    message: "",
    type: "info",
    visible: false,
  });
  const dispatch = useAppDispatch();

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type, visible: true });
  }, []);

  // Helper to map Supabase user to our local Tier 1 Identity User interface
  const mapSupabaseUser = useCallback(
    (supabaseUser: any): User => ({
      id: supabaseUser.id,
      email: supabaseUser.email || null,
      displayName:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email?.split("@")[0] ||
        null,
      photoURL: supabaseUser.user_metadata?.avatar_url || null,
      userType: supabaseUser.user_metadata?.user_type || null,
      isVerified:
        !!supabaseUser.email_confirmed_at ||
        supabaseUser.user_metadata?.email_verified ||
        supabaseUser.user_metadata?.is_verified ||
        false,
    }),
    []
  );

  useEffect(() => {
    // 1. Initial Session Check
    const checkInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Check for verification success in URL hash
        if (typeof window !== "undefined" && window.location.hash) {
          const hash = window.location.hash;
          if (hash.includes("type=signup") || hash.includes("access_token")) {
            showToast(
              "Email verified successfully! Welcome to NomadLabs.",
              "success"
            );
            setTimeout(() => {
              window.history.replaceState(null, "", window.location.pathname);
            }, 3000);
          }
        }

        if (session?.user) {
          console.log("Initial Session Found:", session.user.email);
          const userData = mapSupabaseUser(session.user);
          setUser(userData);
          dispatch(setReduxUser(userData));
          // Non-blocking identity sync (Tier 1)
          dispatch(syncUserIdentity(userData));
        }
      } catch (err) {
        console.error("Error checking initial session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    // 2. Auth State Change Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth Event Detected: ${event}`, {
        userId: session?.user?.id,
        email: session?.user?.email,
        hasSession: !!session,
      });

      if (session?.user) {
        const userData = mapSupabaseUser(session.user);
        setUser(userData);
        dispatch(setReduxUser(userData));

        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          console.log("Triggering syncUserIdentity for event:", event);
          // Sync Identity to Tier 1
          dispatch(syncUserIdentity(userData))
            .unwrap()
            .then(() =>
              console.log("SyncUserIdentity successful for:", userData.email)
            )
            .catch((err: any) =>
              console.error("SyncUserIdentity failed for:", userData.email, err)
            );

          // Redirect managers to dashboard if they land on public/auth pages
          if (event === "SIGNED_IN") {
            const currentPath = window.location.pathname;
            const metadataType = session.user.user_metadata?.user_type;

            if (metadataType === "manager") {
              if (currentPath === "/" || currentPath.startsWith("/auth")) {
                console.log("Redirecting manager to host dashboard");
                window.location.href = "/dashboard/host";
              }
            }
          }
        }
      } else {
        console.log("No auth session, clearing user state");
        setUser(null);
        dispatch(clearReduxUser());

        // Global Router Guard: Redirect to home if on a protected path after logout
        const currentPath = window.location.pathname;
        const protectedPaths = ["/dashboard", "/onboarding", "/settings"];

        if (protectedPaths.some((path) => currentPath.startsWith(path))) {
          console.log("On protected path without session, redirecting to home");
          window.location.href = "/";
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch, mapSupabaseUser, showToast]);

  const signInWithGoogle = async () => {
    try {
      await dispatch(reduxSignInWithGoogle()).unwrap();
    } catch (error: any) {
      console.error("Google Sign-In Error", error);
      showToast(error.message || "Failed to sign in with Google", "error");
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await dispatch(reduxLoginWithEmail({ email, pass })).unwrap();
      showToast("Signed in successfully!", "success");
    } catch (error: any) {
      console.error("Login Error", error);
      showToast(error.message || "Invalid email or password", "error");
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    metadata: any = {}
  ) => {
    try {
      await dispatch(reduxSignUpWithEmail({ email, pass, metadata })).unwrap();
      showToast(
        "Signup successful! Please check your email for verification.",
        "success"
      );
    } catch (error: any) {
      console.error("Signup Error", error);
      showToast(error.message || "Signup failed. Please try again.", "error");
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await dispatch(reduxSignOutUser()).unwrap();
      showToast("Signed out successfully", "info");
    } catch (error: any) {
      console.error("Sign-Out Error", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOutUser,
        loginWithEmail,
        signUpWithEmail,
        showToast,
      }}
    >
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
