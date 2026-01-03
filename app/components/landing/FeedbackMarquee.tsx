"use client";
import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const testimonials = [
  { user: "Carlos", text: "Amazing stay!", country: "Spain" },
  { user: "Emma", text: "Incredible host tools", country: "Australia" },
  { user: "Sarah", text: "Best luxury experience", country: "USA" },
  { user: "Kenji", text: "Design perfection", country: "Japan" },
  { user: "Priya", text: "Loved the atmosphere", country: "India" },
  { user: "Matteo", text: "Truly magical", country: "Italy" },
];

const FeedbackMarquee: React.FC = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Create an infinite horizontal scroll
      const content = marqueeRef.current?.firstChild as HTMLElement;
      if (!content) return;

      const totalWidth = content.offsetWidth;

      gsap.to(content, {
        x: -totalWidth / 2,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-32 bg-[#0D0D0D] overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-white">
          Guest <span className="text-[#C5A059] italic">Love</span>
        </h2>
      </div>

      <div ref={marqueeRef} className="relative w-full flex perspective-1000">
        <div className="flex gap-8 px-8 w-max">
          {/* Double the list for seamless loop */}
          {[...testimonials, ...testimonials].map((item, i) => (
            <div
              key={i}
              className="w-[300px] p-8 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300"
            >
              <p className="font-serif text-xl text-white mb-4">
                "{item.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#C5A059] uppercase tracking-wider">
                  {item.user}
                </span>
                <span className="text-xs text-zinc-500">{item.country}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0D0D0D] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0D0D0D] to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default FeedbackMarquee;
