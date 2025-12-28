"use client";
import React, { useEffect } from "react";
import Hero from "../components/Hero";
import FeaturedStays from "../components/FeaturedStays";
import AIConcierge from "../components/AIConcierge";
import gsap from "gsap";

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Reveal main landing sections smoothly
    gsap.fromTo(
      ".fade-up",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".fade-up",
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div className="overflow-hidden">
      <Hero />

      {/* Experience Intro */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <div className="fade-up max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-6 block">
              The Nomad Philosophy
            </span>
            <h2 className="font-serif text-3xl md:text-6xl text-zinc-900 dark:text-white mb-8 leading-tight">
              We don't just book rooms. <br />
              We curate <span className="italic">atmospheres.</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
              Every stay in our collection is vetted for more than just quality.
              We look for soul, for architectural integrity, and for the feeling
              of being somewhere that truly matters.
            </p>
          </div>
        </div>
      </section>

      <FeaturedStays />

      {/* Testimonial / Brand Moment */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-fixed bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=2000)",
          }}
        >
          <div className="absolute inset-0 bg-zinc-900/40 dark:bg-zinc-950/70" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <blockquote className="font-serif text-2xl md:text-4xl max-w-3xl mx-auto leading-relaxed italic">
            "Nomad Labs has transformed my business travel into a sequence of
            beautiful moments. I no longer just travel; I live, everywhere."
          </blockquote>
          <cite className="block mt-8 text-sm uppercase tracking-widest font-medium opacity-80">
            — Julianne V., Design Director
          </cite>
        </div>
      </section>

      <AIConcierge />
    </div>
  );
};

export default LandingPage;
