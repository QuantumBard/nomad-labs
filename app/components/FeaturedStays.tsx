import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STAYS = [
  {
    id: 1,
    name: "The Obsidian Retreat",
    location: "Reykjavík, Iceland",
    rating: 4.9,
    price: "₹70,000",
    image:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Canyon Mirage",
    location: "Arizona, USA",
    rating: 4.8,
    price: "₹1,00,000",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Verdant Villa",
    location: "Ubud, Bali",
    rating: 5.0,
    price: "₹50,000",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Alpine Glasshouse",
    location: "Zermatt, Switzerland",
    rating: 4.9,
    price: "₹1,20,000",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
  },
];

const FeaturedStays: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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
  }, []);

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

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STAYS.map((stay, i) => (
            <div
              key={stay.id}
              // Fixed: Ref callback must return void, not the assigned element to satisfy TypeScript constraints.
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-zinc-200 dark:bg-zinc-800">
                <img
                  src={stay.image}
                  alt={stay.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold dark:text-white">
                    {stay.rating}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs">
                  <MapPin size={12} className="mr-1" />
                  <span>{stay.location}</span>
                </div>
                <h3 className="text-zinc-900 dark:text-white font-semibold text-lg">
                  {stay.name}
                </h3>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-zinc-900 dark:text-white font-bold">
                    {stay.price}{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      / night
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStays;
