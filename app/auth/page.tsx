"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Chrome, ArrowRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user, loginWithEmail, signUpWithEmail, signInWithGoogle, loading } =
    useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      setSuccess(true);
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      setError("Google sign in failed");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6">
        <div className="text-center space-y-4">
          <CheckCircle2
            size={64}
            className="mx-auto text-green-500 animate-bounce"
          />
          <h2 className="text-2xl font-serif text-zinc-900 dark:text-white">
            Welcome to the Club
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Redirecting you to the sanctuary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 pt-20">
      {/* Left - Hero Image */}
      <div className="hidden lg:block relative overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000"
          alt="luxury stay"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-5xl font-serif mb-6 leading-tight">
              Your gateway to the world's most{" "}
              <span className="italic">exclusive</span> stays.
            </h2>
            <p className="text-zinc-300 font-light text-lg">
              Join a global community of mindful travelers and gain access to
              curated hidden gems.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center p-6 bg-white dark:bg-zinc-950">
        <div ref={formRef} className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-white mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-light">
              {isLogin
                ? "Welcome back, traveler."
                : "Begin your journey with Nomad Labs today."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex items-center justify-center space-x-3 w-full py-3 px-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-medium text-zinc-700 dark:text-zinc-300 disabled:opacity-50"
            >
              <Chrome size={20} />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400 tracking-widest">
                Or email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-zinc-400 outline-none dark:text-white transition-all"
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-zinc-400 outline-none dark:text-white transition-all"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs italic">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {isLogin ? "Enter Nomad Labs" : "Create My Account"}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
