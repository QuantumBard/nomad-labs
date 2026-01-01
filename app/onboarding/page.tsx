"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { syncUserIdentity } from "@/store/features/user/userSlice";

const OnboardingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const finalizeSetup = async () => {
      if (loading) return;
      if (!user) {
        router.push("/auth");
        return;
      }

      // 1. If we already have a userType, ensure the identity is synced and redirect
      if (user.userType) {
        try {
          // Double check identity sync to be safe
          await dispatch(syncUserIdentity(user)).unwrap();

          // Delay slightly for effect (premium feel)
          setTimeout(() => {
            if (user.userType === "manager") {
              router.push("/dashboard/host");
            } else {
              router.push("/");
            }
          }, 1500);
        } catch (err) {
          console.error("Setup sync failed:", err);
          // Still try to redirect if identity sync fails (might be existing)
          router.push(user.userType === "manager" ? "/dashboard/host" : "/");
        }
      } else {
        // 2. If for some reason we STILL don't have a userType (e.g. edge case),
        // default to "traveller" or we could show the dialog here as emergency fallback.
        // For now, following user request to remove dialog, we'll default to traveller.
        router.push("/");
      }
    };

    finalizeSetup();
  }, [user, loading, router, dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full space-y-8 animate-in fade-in duration-700">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-100 dark:border-zinc-900" />
          <div className="absolute inset-0 rounded-full border-t-2 border-zinc-900 dark:border-white animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle2
              className="text-zinc-200 dark:text-zinc-800"
              size={32}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-serif text-zinc-900 dark:text-white">
            Personalizing your sanctuary
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-light text-lg">
            Finalizing your secure profile and curating your experience...
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-zinc-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm tracking-wider uppercase">
            Syncing Tier 1 Identity
          </span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
