"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
import { Sun, Moon, User, Menu, X, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOutUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Stays", path: "/" },
    { name: "Experiences", path: "#" },
    { name: "Journal", path: "#" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-200 dark:border-zinc-800"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex flex-col items-start text-zinc-900 dark:text-white group"
        >
          <svg
            width="120"
            height="40"
            viewBox="0 0 220 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="scale-75 origin-left"
          >
            <text
              x="0"
              y="40"
              fontFamily="Inter, sans-serif"
              fontSize="32"
              fontWeight="600"
              fill="currentColor"
              letterSpacing="2"
            >
              NOMAD
            </text>
            <text
              x="0"
              y="58"
              fontFamily="Inter, sans-serif"
              fontSize="14"
              fontWeight="400"
              fill="currentColor"
              letterSpacing="4"
            >
              LABS
            </text>
          </svg>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-sm font-medium transition-colors ${
                pathname === link.path
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* Role-specific Link */}
          {user?.userType === "traveller" && (
            <Link
              href="/auth/host"
              className="hidden lg:block text-sm font-medium text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              List your home
            </Link>
          )}
          {user?.userType === "manager" && (
            <Link
              href="/dashboard/host"
              className="hidden lg:block text-sm font-medium text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Host Dashboard
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={signOutUser}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <LogOut size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden border border-zinc-300 dark:border-zinc-700">
                <img
                  src={
                    user.photoURL ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`
                  }
                  alt="avatar"
                />
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Join Club
            </Link>
          )}

          <button
            className="md:hidden p-2 text-zinc-600 dark:text-zinc-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-medium ${
                pathname === link.path
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user?.userType === "traveller" && (
            <Link
              href="/auth/host"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-zinc-900 dark:text-white"
            >
              List your home
            </Link>
          )}
          {user?.userType === "manager" && (
            <Link
              href="/dashboard/host"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-zinc-900 dark:text-white"
            >
              Host Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
