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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownOpen && !(e.target as Element).closest(".relative")) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const navLinks = [
    { name: "Stays", path: "/" },
    { name: "Experiences", path: "#" },
    { name: "Journal", path: "#" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl py-3 md:py-4 shadow-sm border-b border-zinc-200/50 dark:border-zinc-800/50"
          : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex flex-col items-start text-zinc-900 dark:text-white group"
        >
          <svg
            width="110"
            height="38"
            viewBox="0 0 220 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="scale-75 md:scale-90 origin-left transition-transform group-hover:scale-95"
          >
            <text
              x="0"
              y="32"
              className="font-anta"
              fontSize="45"
              fontWeight="600"
              fill="currentColor"
              letterSpacing="2"
            >
              NOMAD
            </text>
            <text
              x="0"
              y="60"
              className="font-antonio uppercase"
              fontSize="24"
              fontWeight="400"
              fill="currentColor"
              letterSpacing="4"
            >
              LABS
            </text>
          </svg>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-xs font-anta uppercase tracking-[0.15em] font-bold transition-all duration-300 relative group/link ${
                pathname === link.path
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${
                  pathname === link.path
                    ? "w-full"
                    : "w-0 group-hover/link:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Role-specific Link */}
          {user?.userType === "traveller" && (
            <Link
              href="/auth/host"
              className="hidden lg:flex items-center gap-2 text-xs font-anta uppercase tracking-widest font-bold text-zinc-900 dark:text-white px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
            >
              List Home
            </Link>
          )}
          {user?.userType === "manager" && (
            <Link
              href="/dashboard/host"
              className="hidden lg:flex items-center gap-2 text-xs font-anta uppercase tracking-widest font-bold text-zinc-900 dark:text-white px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
            >
              Dashboard
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div className="relative flex items-center gap-4">
              {/* User Dropdown Trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex items-center gap-2 p-1 pl-1 pr-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-300 dark:border-zinc-700">
                  <img
                    src={
                      user.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-zinc-600 dark:text-zinc-400">
                  <Menu size={16} />
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 font-antonio">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 font-antonio"
                    >
                      <User size={16} />
                      <span>Visit Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOutUser();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 font-antonio"
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-anta uppercase tracking-widest font-bold hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Join Club
            </Link>
          )}

          <button
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-anta uppercase tracking-widest font-bold transition-colors py-2 ${
                  pathname === link.path
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-700 dark:text-zinc-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user?.userType === "traveller" && (
              <Link
                href="/auth/host"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-anta uppercase tracking-widest font-bold text-foreground py-2"
              >
                List your home
              </Link>
            )}
            {user?.userType === "manager" && (
              <Link
                href="/dashboard/host"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-anta uppercase tracking-widest font-bold text-foreground py-2"
              >
                Host Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
