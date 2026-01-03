"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Chrome,
  ArrowRight,
  CheckCircle2,
  User,
} from "lucide-react";
import gsap from "gsap";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, {
          full_name: username,
          user_type: "traveller",
        });
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
          <h2 className="text-2xl font-abril text-zinc-900 dark:text-white">
            Welcome to the Club
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-antonio">
            Redirecting you to the sanctuary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background pt-20">
      {/* Left - Hero Image */}
      <div className="hidden lg:block relative overflow-hidden bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000"
          alt="luxury stay"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-5xl font-abril mb-6 leading-tight">
              Your gateway to the world's most{" "}
              <span className="italic">exclusive</span> stays.
            </h2>
            <p className="text-zinc-300 font-antonio text-lg">
              Join a global community of mindful travelers and gain access to
              curated hidden gems.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div ref={formRef} className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-abril text-foreground mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-foreground/60 font-antonio">
              {isLogin
                ? "Welcome back, traveler."
                : "Begin your journey with Nomad Labs today."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex items-center justify-center space-x-3 w-full py-3 px-4 border border-zinc-300 dark:border-zinc-700 rounded-xl dark:hover:bg-zinc-500 transition-all font-anta text-xs uppercase tracking-widest font-bold text-zinc-700 dark:text-zinc-200 disabled:opacity-50 bg-transparent"
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
              <span className="bg-background px-4 text-foreground/40 tracking-widest font-anta">
                Or email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-antonio transition-all"
                  />
                </div>
              )}
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
                  className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-antonio transition-all"
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
                  className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-antonio transition-all"
                />
              </div>
              {!isLogin && (
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground font-antonio transition-all"
                  />
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm font-antonio">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-anta uppercase tracking-widest text-xs font-bold flex items-center justify-center space-x-2 hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
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

          <div className="text-center space-y-4 pt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors block w-full font-antonio"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100 dark:border-zinc-900" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-foreground/40 font-anta">
                <span className="bg-background px-2">For Hosts</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/auth/host")}
              className="text-sm font-anta uppercase tracking-wider text-foreground hover:text-accent transition-all"
            >
              Interested in hosting? Sign in or Sign up here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
