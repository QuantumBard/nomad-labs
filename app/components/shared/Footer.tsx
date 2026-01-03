import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-zinc-900/50 py-12 md:py-16 border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="col-span-1 sm:col-span-2">
            <svg
              width="150"
              height="45"
              viewBox="0 0 220 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-6 text-zinc-900 dark:text-white"
            >
              <text
                x="0"
                y="32"
                className="font-anta"
                fontSize="38"
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
                fontSize="20"
                fontWeight="400"
                fill="currentColor"
                letterSpacing="4"
              >
                LABS
              </text>
            </svg>
            <p className="text-zinc-800 dark:text-zinc-400 max-w-sm mb-4 md:mb-6 font-antonio text-sm md:text-base">
              Elevating the standard of global travel through curated stays and
              cinematic experiences. Your journey, redefined.
            </p>
            <div className="flex space-x-4">
              <button className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <Instagram size={20} />
              </button>
              <button className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </button>
              <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Youtube size={20} />
              </button>
            </div>
          </div>

          <div>
            <h5 className="font-anta text-zinc-900 dark:text-white mb-4 md:mb-6 uppercase text-xs tracking-widest">
              Explore
            </h5>
            <ul className="space-y-3 text-zinc-800 dark:text-zinc-400 text-sm font-antonio">
              <li>
                <Link
                  href="/"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Stays
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Experiences
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Adventures
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div className="grid grid-rows-2 gap-6 md:gap-8">
            <div>
              <h5 className="font-anta text-zinc-900 dark:text-white mb-4 md:mb-6 uppercase text-xs tracking-widest">
                Hosting
              </h5>
              <ul className="space-y-3 text-zinc-800 dark:text-zinc-400 text-sm font-antonio">
                <li>
                  <Link
                    href="/auth/host"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    List your home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/host"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Host Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-6 md:mt-8">
              <h5 className="font-anta text-gray-900 dark:text-white mb-4 md:mb-6 uppercase text-xs tracking-widest">
                Company
              </h5>
              <ul className="space-y-3 text-zinc-800 dark:text-zinc-400 text-sm font-antonio">
                <li>
                  <Link
                    href="/story"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sustainability"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Sustainability
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h5 className="font-anta text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-widest">
              Legal
            </h5>
            <ul className="space-y-3 text-zinc-800 dark:text-zinc-400 text-sm font-antonio">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-zinc-700 dark:text-zinc-400 tracking-widest uppercase font-anta">
          <p>© 2024 Nomad Labs Global Inc. All rights reserved.</p>
          <p>Designed by Architect in London</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
