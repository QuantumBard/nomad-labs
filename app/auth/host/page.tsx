"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  Building2,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const HostAuthPage = () => {
  const {
    loginWithEmail,
    signUpWithEmail,
    user,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    phone: "",
    propertyAddress: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(formData.email, formData.password);
        router.push("/dashboard/host");
      } else {
        await signUpWithEmail(formData.email, formData.password, {
          user_type: "manager",
          full_name: formData.fullName,
          business_name: formData.businessName,
          phone: formData.phone,
          property_address: formData.propertyAddress,
          requires_verification: true,
        });
        setStep(4); // Success step
      }
    } catch (error: any) {
      setError(error.message || "Authentication failed");
      console.error("Host Auth Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800">
        {step < 4 && (
          <div className="mb-8">
            {!isLogin && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Step {step} of 3
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1 w-8 rounded-full transition-colors ${
                        s <= step
                          ? "bg-zinc-900 dark:bg-white"
                          : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {isLogin
                ? "Host Sign In"
                : step === 1
                ? "Create your host account"
                : step === 2
                ? "Business details"
                : "Property info"}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {isLogin
                ? "Welcome back to your business sanctuary."
                : "Join our community of world-class hosts."}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                    placeholder="john@business.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <span>{loading ? "Signing in..." : "Sign In as Host"}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                      placeholder="john@business.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-4 mt-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                  >
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                      placeholder="Nomad Retreats Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-[2] py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                      <span>Continue</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Primary Property Address
                    </label>
                    <input
                      type="text"
                      name="propertyAddress"
                      required
                      value={formData.propertyAddress}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-all"
                      placeholder="123 Alpine Way, Switzerland"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
                    <strong>Note:</strong> Your account will be subject to
                    manual review. You will be able to set up your listing
                    immediately, but it will go live after verification.
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs italic">{error}</p>
                  )}
                  <div className="flex space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <span>{loading ? "Creating..." : "Complete Setup"}</span>
                      {!loading && <ArrowRight size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Application Received
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                    We've sent a verification email to{" "}
                    <strong>{formData.email}</strong>. Please confirm your email
                    to start setting up your property.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
                  >
                    Return Home
                  </button>
                </div>
              )}
            </>
          )}
        </form>

        {step < 4 && (
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center space-y-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setStep(1);
                setError("");
              }}
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors block w-full"
            >
              {isLogin
                ? "Don't have a host account? Sign up"
                : "Already have a host account? Sign in"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-zinc-400">
                <span className="bg-white dark:bg-zinc-900 px-2">
                  Not a host?
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/auth")}
              className="text-sm font-medium text-zinc-900 dark:text-white hover:underline transition-all"
            >
              Sign up as a traveller instead
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostAuthPage;
