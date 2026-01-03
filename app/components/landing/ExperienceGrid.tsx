"use client";
import React, { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  Star,
  MapPin,
  Leaf,
  ShieldCheck,
  Zap,
  Droplets,
  Recycle,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SUSTAINABLE_STAYS = [
  {
    id: 1,
    title: "The Ancient Oak Treehouse",
    location: "ORREGON, USA",
    badge: "GOLD STANDARD",
    badgeIcon: <ShieldCheck className="w-3 h-3" />,
    rating: 4.96,
    reviews: 128,
    price: 320,
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Rainforest Canopy Lodge",
    location: "PUNTARENAS, COSTA RICA",
    badge: "CARBON NEGATIVE",
    badgeIcon: <Leaf className="w-3 h-3" />,
    rating: 4.92,
    reviews: 84,
    price: 240,
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Nordic Pine Retreat",
    location: "LAPLAND, FINLAND",
    badge: "GREEN KEY",
    badgeIcon: <Recycle className="w-3 h-3" />,
    rating: 5.0,
    reviews: 203,
    price: 410,
    image:
      "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Amazon River Float",
    location: "MANAUS, BRAZIL",
    badge: "WATER SAVER",
    badgeIcon: <Droplets className="w-3 h-3" />,
    rating: 4.85,
    reviews: 56,
    price: 185,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Bamboo Grove Villa",
    location: "BALI, INDONESIA",
    badge: "SOLAR POWERED",
    badgeIcon: <Zap className="w-3 h-3" />,
    rating: 4.98,
    reviews: 312,
    price: 150,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Alpine Forest Hut",
    location: "INTERLAKEN, SWITZERLAND",
    badge: "ZERO WASTE",
    badgeIcon: <Recycle className="w-3 h-3" />,
    rating: 4.91,
    reviews: 115,
    price: 380,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
  },
];

const ExperienceGrid: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax effect
      gsap.to(".forest-bg", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        y: 100,
        ease: "none",
      });

      // Individual card appearance animation
      const cards = gsap.utils.toArray<HTMLElement>(".stay-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Triggers when the top of the card hits 85% of viewport height
            toggleActions: "play none none none",
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
          // Adding a small delay for cards in the same row to create a nice sequenced feel
          delay: (i % 3) * 0.1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 min-h-screen overflow-hidden bg-[#0a0f0b] text-white"
    >
      {/* Wild Forest Background Overlay */}
      <div
        className="forest-bg absolute inset-0 z-0 opacity-80 scale-110"
        style={{
          backgroundImage: "url('/images/forest-treehouse.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) brightness(0.6)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/30 to-background z-0" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Filter Tabs - Inspired by image */}
        {/* Filter Tabs - Inspired by image */}
        <div className="flex flex-wrap items-center justify-center mb-16">
          <div className="bg-primary/80 backdrop-blur-md p-1.5 rounded-full border border-primary/10 flex flex-wrap items-center gap-1 justify-center">
            <button className="px-6 py-3 bg-white text-black rounded-full font-anta text-xs uppercase tracking-widest font-bold shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
              <MapPin className="w-3.5 h-3.5" /> All Stays
            </button>
            {["Treehouses", "Eco-Cabins", "Forest Domes", "River Lodges"].map(
              (tab) => (
                <button
                  key={tab}
                  className="px-6 py-3 rounded-full font-anta text-xs uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95"
                >
                  {tab}
                </button>
              )
            )}
            <div className="w-[1px] h-6 bg-white/10 mx-2 hidden md:block" />
            <button className="p-3 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="font-abril text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Featured Sustainable Stays
          </h2>
          <p className="text-white/60 font-antonio text-xl max-w-2xl">
            Hand-picked homes that give back to nature, each certified for its
            environmental contribution.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SUSTAINABLE_STAYS.map((stay) => (
            <div
              key={stay.id}
              className="stay-card group relative bg-white/5 backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 shadow-xl hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={stay.image}
                  alt={stay.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-anta tracking-widest uppercase">
                    {stay.badgeIcon}
                    {stay.badge}
                  </div>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all duration-300">
                  <Heart
                    className="w-5 h-5"
                    fill="currentColor"
                    fillOpacity={0}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 relative">
                {/* Floating Location Badge overlap */}
                <div className="absolute -top-6 right-8">
                  <div className="bg-[#2d4a3e] rounded-2xl px-6 py-3 shadow-lg flex items-center gap-2 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[10px] font-bold tracking-widest uppercase font-anta text-white">
                      {stay.location}
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="font-abril text-3xl text-white mb-2 leading-none">
                    {stay.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-antonio font-bold text-white text-lg">
                        {stay.rating}
                      </span>
                    </div>
                    <span className="text-white/40 text-sm font-antonio">
                      ({stay.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] uppercase font-anta tracking-widest mb-1">
                        Starting Price
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-abril text-white">
                          ${stay.price}
                        </span>
                        <span className="text-white/40 text-sm font-antonio">
                          / night
                        </span>
                      </div>
                    </div>

                    <button className="px-8 py-3 bg-white text-black rounded-full font-anta font-bold text-xs uppercase tracking-widest hover:bg-accent transition-colors duration-300 shadow-lg hover:shadow-accent/20">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <button className="px-10 py-4 border border-white/20 hover:bg-white hover:text-black hover:border-white text-white rounded-full font-anta font-bold text-xs uppercase tracking-widest transition-all duration-300 group flex items-center gap-3">
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExperienceGrid;
