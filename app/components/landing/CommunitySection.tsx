"use client";

import React from "react";
import { MoveRight, Users, Share2, ArrowUpRight } from "lucide-react";

interface CommunityFeature {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

const features: CommunityFeature[] = [
  {
    id: 1,
    title: "Collaboration",
    description:
      "We specialise in transforming your online presence and accelerating business growth through.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1742&auto=format&fit=crop",
    icon: <Users size={20} className="text-white" />,
  },
  {
    id: 2,
    title: "Networking",
    description:
      "We specialise in transforming your online presence and accelerating business growth through.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1740&auto=format&fit=crop",
    icon: <Share2 size={20} className="text-white" />,
  },
];

const CommunitySection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Side: Info */}
          <div className="lg:col-span-4 space-y-6 md:space-y-10">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-abril tracking-tight">
                Community
              </h2>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="h-[1px] flex-grow max-w-[150px] sm:max-w-[200px] bg-foreground/30 group-hover:bg-foreground group-hover:max-w-[200px] sm:group-hover:max-w-[250px] transition-all duration-500" />
                <MoveRight
                  className="text-foreground/30 group-hover:text-foreground transition-colors"
                  size={20}
                />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 max-w-sm">
              <p className="text-foreground/70 font-antonio text-base md:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
              <p className="text-foreground/70 font-antonio text-base md:text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
            </div>

            <button className="flex items-center gap-2 text-xs sm:text-sm font-anta uppercase tracking-[0.2em] font-bold group border-b border-transparent hover:border-foreground transition-all pb-1">
              Join Us{" "}
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </button>
          </div>

          {/* Right Side: Feature Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-2"
              >
                {/* Background Image */}
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />

                {/* Icon Plate */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 lg:p-10 text-white">
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-2xl md:text-3xl font-abril">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 font-antonio text-sm md:text-base leading-snug max-w-[220px] md:max-w-[250px] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Subtle bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
