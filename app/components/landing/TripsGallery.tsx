"use client";

import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const trips = [
  {
    id: 1,
    title: "Brazil",
    description: "Amazonian Rainforest Expedition",
    image:
      "https://images.unsplash.com/photo-1551529489-5c97b567c760?q=80&w=774&auto=format&fit=crop",
    rotation: -6,
    zIndex: 1,
    className: "md:w-[350px] md:h-[450px]",
  },
  {
    id: 2,
    title: "Bangkok",
    description: "Urban Night Markets & Temples",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=800",
    rotation: 4,
    zIndex: 2,
    className: "md:w-[300px] md:h-[380px] md:-mt-12",
  },
  {
    id: 3,
    title: "Nairobi",
    description: "Safari & Wilderness Adventure",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800",
    rotation: -3,
    zIndex: 3,
    className: "md:w-[320px] md:h-[400px]",
  },
  {
    id: 4,
    title: "Kathmandu",
    description: "Himalayan Peaks & Spirituality",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
    rotation: 5,
    zIndex: 2,
    className: "md:w-[360px] md:h-[480px] md:-mt-24",
  },
  {
    id: 5,
    title: "Norway",
    description: "Northern Lights & Fjords",
    image:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800",
    rotation: -5,
    zIndex: 1,
    className: "md:w-[310px] md:h-[390px]",
  },
  {
    id: 6,
    title: "Santorini",
    description: "Aegean Sunsets & Architecture",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
    rotation: 3,
    zIndex: 2,
    className: "md:w-[340px] md:h-[420px] md:-mt-16",
  },
  {
    id: 7,
    title: "Kyoto",
    description: "Ancient Shrines & Tea Gardens",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    rotation: -4,
    zIndex: 3,
    className: "md:w-[330px] md:h-[440px]",
  },
  {
    id: 8,
    title: "New York",
    description: "Concrete Jungle Dreams",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800",
    rotation: 6,
    zIndex: 1,
    className: "md:w-[300px] md:h-[400px] md:-mt-8",
  },
  {
    id: 9,
    title: "Marrakech",
    description: "Souks & Desert Gateway",
    image:
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800",
    rotation: -2,
    zIndex: 2,
    className: "md:w-[350px] md:h-[460px]",
  },
  {
    id: 10,
    title: "Iceland",
    description: "Land of Fire & Ice",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=800",
    rotation: 4,
    zIndex: 3,
    className: "md:w-[380px] md:h-[480px] md:-mt-20",
  },
  {
    id: 11,
    title: "Peru",
    description: "Incan Ruins & Mountains",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800",
    rotation: -5,
    zIndex: 1,
    className: "md:w-[320px] md:h-[410px]",
  },
  {
    id: 12,
    title: "Bali",
    description: "Island Paradise & Culture",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    rotation: 3,
    zIndex: 2,
    className: "md:w-[340px] md:h-[430px] md:-mt-10",
  },
];

const TripsGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        // Initial state
        gsap.set(card, {
          y: 100,
          opacity: 0,
          rotate: 0, // Start straight
        });

        // Entrance animation
        gsap.to(card, {
          y: 0,
          opacity: 1,
          rotate: trips[i].rotation, // Rotate to final random angle
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=50",
            toggleActions: "play none none reverse",
          },
          delay: (i % 4) * 0.1, // Stagger effect based on rows mostly
        });

        // Hover effect
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            rotate: 0,
            zIndex: 50,
            duration: 0.4,
            ease: "back.out(1.7)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            rotate: trips[i].rotation,
            zIndex: trips[i].zIndex,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-background text-foreground overflow-hidden transition-colors duration-500"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl font-abril leading-[0.9] text-foreground">
              Explore <br />
              <span className="italic relative inline-block text-foreground/90">
                10000+
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-accent"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              trips
            </h2>
          </div>
          <div className="max-w-md text-right mt-8 md:mt-0">
            <p className="text-xl font-antonio text-foreground/60 mb-6">
              Curated journeys for the modern nomad. From hidden architectural
              gems to untouched wilderness.
            </p>
            <button className="group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-anta uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-colors">
              View All Destinations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 relative z-10 w-full">
          {trips.map((trip, index) => (
            <div
              key={trip.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`relative bg-white dark:bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-gray-200 dark:border-white/10 transition-all will-change-transform cursor-pointer shadow-lg hover:shadow-2xl ${
                trip.className || "w-full md:w-[350px] aspect-[4/5]"
              }`}
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-gray-900 group">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-95 dark:opacity-80 group-hover:opacity-100"
                />

                {/* Overlay Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-anta uppercase tracking-widest text-white mb-2 border border-white/20">
                      <MapPin className="w-3 h-3" /> {trip.title}
                    </span>
                    <h3 className="text-2xl font-abril text-white leading-tight">
                      {trip.description}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Call to Action Card */}
          <div className="relative bg-accent p-8 rounded-2xl shadow-lg w-[300px] h-[300px] flex flex-col justify-center items-center text-center rotate-6 hover:rotate-0 transition-transform duration-300 md:self-center">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 -rotate-45" />
            </div>
            <h3 className="text-3xl font-abril mb-2 text-black">Your Turn</h3>
            <p className="font-antonio text-black/70 mb-6 leading-tight">
              Create a custom itinerary tailored to your style.
            </p>
            <button className="text-xs font-bold font-anta uppercase tracking-widest border-b-2 border-black pb-1 hover:text-white hover:border-white transition-colors text-black">
              Start Planning
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripsGallery;
