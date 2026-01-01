"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { User, Briefcase, ArrowRight } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { updateOnboarding } from "@/store/features/user/userSlice";

const OnboardingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedRole, setSelectedRole] = useState<
    "traveller" | "manager" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) return null;
  if (!user) {
    router.push("/auth");
    return null;
  }

  const handleCompleteOnboarding = async () => {
    if (!selectedRole || !user) return;
    setIsSubmitting(true);

    try {
      const resultAction = await dispatch(
        updateOnboarding({ userId: user.id, role: selectedRole })
      );

      if (updateOnboarding.fulfilled.match(resultAction)) {
        if (selectedRole === "manager") {
          router.push("/dashboard/host");
        } else {
          router.push("/");
        }
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (error: any) {
      console.error("Onboarding Error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4">
            Welcome to Nomad Labs
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            How do you plan to use the platform?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Traveller Option */}
          <button
            onClick={() => setSelectedRole("traveller")}
            className={`p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
              selectedRole === "traveller"
                ? "border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 shadow-xl"
                : "border-zinc-200 dark:border-zinc-800 bg-transparent hover:border-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${
                selectedRole === "traveller"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              }`}
            >
              <User size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              I'm a Traveller
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              I want to discover and book unique stays and experiences around
              the world.
            </p>
          </button>

          {/* Manager Option */}
          <button
            onClick={() => setSelectedRole("manager")}
            className={`p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
              selectedRole === "manager"
                ? "border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 shadow-xl"
                : "border-zinc-200 dark:border-zinc-800 bg-transparent hover:border-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${
                selectedRole === "manager"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              }`}
            >
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              I'm a Host
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              I want to list my property, manage bookings, and welcome guests to
              my space.
            </p>
          </button>
        </div>

        <button
          onClick={handleCompleteOnboarding}
          disabled={!selectedRole || isSubmitting}
          className="w-full py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <span>{isSubmitting ? "Setting up..." : "Continue"}</span>
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
