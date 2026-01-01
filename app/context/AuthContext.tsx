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
  syncUserProfile,
} from "@/store/features/user/userSlice";
import {
  signInWithGoogle as reduxSignInWithGoogle,
  loginWithEmail as reduxLoginWithEmail,
  signUpWithEmail as reduxSignUpWithEmail,
  signOutUser as reduxSignOutUser,
} from "@/store/features/auth/authSlice";

interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  userType: "traveller" | "manager" | "admin";
  businessName: string | null;
  businessPhone: string | null;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Helper to map Supabase user to our local User interface
  const mapSupabaseUser = useCallback(
    (supabaseUser: any): User => ({
      id: supabaseUser.id,
      email: supabaseUser.email || null,
      displayName:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email?.split("@")[0] ||
        null,
      photoURL: supabaseUser.user_metadata?.avatar_url || null,
      userType: supabaseUser.user_metadata?.user_type || "traveller",
      businessName: supabaseUser.user_metadata?.business_name || null,
      businessPhone: supabaseUser.user_metadata?.phone || null,
      isVerified: supabaseUser.user_metadata?.is_verified || false,
    }),
    []
  );

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION immediately on subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Change Event:", event);
      if (session?.user) {
        const userData = mapSupabaseUser(session.user);
        setUser(userData);
        dispatch(setReduxUser(userData));

        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          await dispatch(syncUserProfile(userData)).unwrap();

          // Check if onboarding is needed (for new OAuth users)
          if (!session.user.user_metadata?.user_type && event === "SIGNED_IN") {
            window.location.href = "/onboarding";
          }

          // Redirect hosts to dashboard if they are on the home page
          const isPublicView =
            new URLSearchParams(window.location.search).get("view") ===
            "public";
          if (
            userData.userType === "manager" &&
            window.location.pathname === "/" &&
            !isPublicView
          ) {
            window.location.href = "/dashboard/host";
          }
        }
      } else {
        console.log("No session user, clearing state");
        setUser(null);
        dispatch(clearReduxUser());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch, mapSupabaseUser]);

  const signInWithGoogle = async () => {
    try {
      await dispatch(reduxSignInWithGoogle()).unwrap();
    } catch (error: any) {
      console.error("Google Sign-In Error", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await dispatch(reduxLoginWithEmail({ email, pass })).unwrap();
    } catch (error: any) {
      console.error("Login Error", error);
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
    } catch (error: any) {
      console.error("Signup Error", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await dispatch(reduxSignOutUser()).unwrap();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
