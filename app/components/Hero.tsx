import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      imageRef.current,
      { scale: 1.2, filter: "brightness(0)" },
      { scale: 1, filter: "brightness(1)", duration: 2, ease: "power2.out" }
    )
      .fromTo(
        headlineRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=1"
      )
      .fromTo(
        subtextRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        btnRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.5"
      );

    // Parallax effect on scroll
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 200,
      ease: "none",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000)",
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1
          ref={headlineRef}
          className="font-serif text-5xl md:text-8xl text-white mb-6 leading-tight"
        >
          Luxury <span className="italic">Rediscovered</span>
        </h1>
        <p
          ref={subtextRef}
          className="text-zinc-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light tracking-wide"
        >
          Curated sanctuary spaces for the modern wanderer. Escape into a world
          where design meets deep comfort.
        </p>
        <div ref={btnRef}>
          <button className="group flex items-center space-x-3 bg-white text-zinc-950 px-8 py-4 rounded-full text-lg font-medium hover:bg-zinc-100 transition-all mx-auto">
            <span>Explore Destinations</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center text-white opacity-60">
        <span className="text-[10px] uppercase tracking-widest mb-2">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-white" />
      </div>
    </section>
  );
};

export default Hero;
