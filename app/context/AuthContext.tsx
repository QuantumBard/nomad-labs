"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  setUser as setReduxUser,
  clearUser as clearReduxUser,
} from "@/lib/redux/slices/userSlice";

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

  const syncUserToSupabase = async (supabaseUser: any) => {
    const mappedUser = mapSupabaseUser(supabaseUser);
    console.log("Syncing user to Supabase profiles:", mappedUser.id);

    const profileData = {
      id: mappedUser.id,
      email: mappedUser.email,
      display_name: mappedUser.displayName,
      photo_url:
        mappedUser.photoURL ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${mappedUser.email}`,
      user_type: mappedUser.userType,
      business_name: mappedUser.businessName,
      business_phone: mappedUser.businessPhone,
      is_verified: mappedUser.isVerified,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });

      if (upsertError?.message.includes("profiles_email_key")) {
        console.warn("Email conflict detected. Updating by email.");
        const { error: updateError } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("email", mappedUser.email);
        if (updateError) throw updateError;
      } else if (upsertError) {
        throw upsertError;
      }
      console.log("✅ User synced successfully");
    } catch (error: any) {
      console.error("❌ Sync Error:", error.message);
    }
  };

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
          await syncUserToSupabase(session.user);

          // Check if onboarding is needed (for new OAuth users)
          if (!session.user.user_metadata?.user_type && event === "SIGNED_IN") {
            window.location.href = "/onboarding";
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
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Google Sign-In Error", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Login Error", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    metadata: any = {}
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            user_type: metadata.user_type || "traveller",
            full_name: metadata.full_name || email.split("@")[0],
            ...metadata,
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Signup Error", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    console.log("signOutUser called");
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("supabase.auth.signOut() successful");
    } catch (error: any) {
      console.error("Sign-Out Error", error.message);
    } finally {
      setLoading(false);
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
