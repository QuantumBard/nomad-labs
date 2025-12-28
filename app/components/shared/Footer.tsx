import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <svg
              width="180"
              height="50"
              viewBox="0 0 220 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-6 opacity-80 text-zinc-900 dark:text-white"
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
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 font-light">
              Elevating the standard of global travel through curated stays and
              cinematic experiences. Your journey, redefined.
            </p>
            <div className="flex space-x-4">
              <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Instagram size={20} />
              </button>
              <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </button>
              <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Linkedin size={20} />
              </button>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-zinc-900 dark:text-white mb-6 uppercase text-xs tracking-widest">
              Company
            </h5>
            <ul className="space-y-3 text-zinc-500 dark:text-zinc-400 text-sm font-light">
              <li>
                <Link
                  href="/story"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-zinc-900 dark:text-white mb-6 uppercase text-xs tracking-widest">
              Legal
            </h5>
            <ul className="space-y-3 text-zinc-500 dark:text-zinc-400 text-sm font-light">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between text-[10px] text-zinc-400 tracking-widest uppercase">
          <p>© 2024 Nomad Labs Global Inc. All rights reserved.</p>
          <p>Designed by Architect in London</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
