"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, MapPin, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublicListings } from "@/store/features/listings/listingsSlice";

gsap.registerPlugin(ScrollTrigger);

const FeaturedStays: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: listings, loading } = useAppSelector((state) => state.listings);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    dispatch(fetchPublicListings({ listingType: "stay" }));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && listings.length > 0) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, [loading, listings.length]);

  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-zinc-900 dark:text-white mb-4">
              Featured Stays
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-lg">
              Hand-picked properties that define the Nomad Labs standard of
              excellence and aesthetic harmony.
            </p>
          </div>
          <button className="text-zinc-900 dark:text-white font-medium border-b border-zinc-900 dark:border-white pb-1 hover:opacity-70 transition-opacity">
            View all collections
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            No featured stays available yet.
          </div>
        ) : (
          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {listings.slice(0, 4).map((stay, i) => (
              <div
                key={stay.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-zinc-200 dark:bg-zinc-800">
                  {stay.photos?.[0] ? (
                    <img
                      src={stay.photos[0]}
                      alt={stay.public_title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin size={40} className="text-zinc-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold dark:text-white">
                      {stay.status === "active" ? "4.8" : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs">
                    <MapPin size={12} className="mr-1" />
                    <span>{stay.view_from_room || "Location not specified"}</span>
                  </div>
                  <h3 className="text-zinc-900 dark:text-white font-semibold text-lg">
                    {stay.public_title}
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-zinc-900 dark:text-white font-bold">
                      ${stay.base_nightly_rate}{" "}
                      <span className="text-xs font-normal text-zinc-500">
                        / night
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedStays;
