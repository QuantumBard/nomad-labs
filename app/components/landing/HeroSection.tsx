"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface SlideData {
  id: number;
  country: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  stats: {
    travelers: string;
    rating: string;
    reviews: string;
  };
}

const slides: SlideData[] = [
  {
    id: 1,
    country: "Finland",
    title: "Beyond Imagination",
    subtitle: "Exploring Finland",
    description:
      "Immerse yourself in the pristine wilderness of the North. From the dance of the Northern Lights to the silence of the snow-covered forests, discover a world where nature reigns supreme.",
    tags: ["Nature & Culture", "Beyond Experience"],
    image: "https://images.unsplash.com/photo-1518203441944-e9578e4b1635",
    stats: { travelers: "12k+", rating: "4.9/5", reviews: "2.5k reviews" },
  },
  {
    id: 2,
    country: "Brazil",
    title: "Rhythm of Life",
    subtitle: "Vibrant Brazil",
    description:
      "Experience the infectious energy of Rio, the vast mysteries of the Amazon, and the sun-soaked coastlines. A destination that pulses with culture, color, and carnival spirit.",
    tags: ["Tropical Vibes", "Cultural Heritage"],
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=2560",
    stats: { travelers: "18k+", rating: "4.8/5", reviews: "3.2k reviews" },
  },
  {
    id: 3,
    country: "Ladakh",
    title: "Land of High Passes",
    subtitle: "Mystical Ladakh",
    description:
      "Journey to the roof of the world. Rugged mountains, serene monasteries, and crystal-clear lakes await in this starkly beautiful Himalayan desert region.",
    tags: ["Adventure", "Spirituality", "Mountains"],
    image:
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=2560",
    stats: { travelers: "5k+", rating: "5.0/5", reviews: "1.1k reviews" },
  },
  {
    id: 4,
    country: "Sri Lanka",
    title: "Pearl of the Ocean",
    subtitle: "Serene Sri Lanka",
    description:
      "From endless tea plantations to pristine beaches and ancient temples. Discover the rich history and warm hospitality of this island paradise.",
    tags: ["Nature", "Heritage", "Beaches"],
    image: "https://images.unsplash.com/photo-1701544857566-dd1d044b9dea",
    stats: { travelers: "10k+", rating: "4.7/5", reviews: "1.8k reviews" },
  },
  {
    id: 5,
    country: "Australia",
    title: "The Great Outdoors",
    subtitle: "Wild Australia",
    description:
      "Explore a continent of contrasts. From the red sands of the Outback to the vibrant marine life of the Great Barrier Reef and iconic cityscapes.",
    tags: ["Wildlife", "Ocean", "Urban"],
    image:
      "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&q=80&w=2560",
    stats: { travelers: "25k+", rating: "4.9/5", reviews: "5k reviews" },
  },
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 6000); // Auto-advance every 6 seconds

    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // GSAP Parallax Effect (kept from original)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".bg-image", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const activeData = slides[currentSlide];

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={activeData.id}
            src={activeData.image}
            alt={activeData.country}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="bg-image w-full h-[120%] object-cover object-center -mt-[5%] absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          {/* Left Column - Navigation/Counter */}
          <div className="hidden md:flex md:col-span-1 flex-col justify-between h-[65vh] border-l border-white/20 pl-6 py-4">
            <div className="flex flex-col items-start gap-8">
              <button
                onClick={prevSlide}
                className="p-2 -ml-3 text-white/40 hover:text-white transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} className="rotate-90" />
              </button>

              <div className="flex flex-col gap-6 text-sm text-white/60 font-medium">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => handleDotClick(index)}
                    className={`transition-all duration-300 text-left ${
                      index === currentSlide
                        ? "text-[#d4af37] scale-150 origin-left font-bold"
                        : "hover:text-white"
                    }`}
                  >
                    {`0${slide.id}`}
                  </button>
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 -ml-3 text-white/40 hover:text-white transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight size={20} className="rotate-90" />
              </button>
            </div>

            <div className="text-xs tracking-[0.2em] text-white/40">
              Scroll for more
            </div>
          </div>

          {/* Center Content - Dynamic */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex gap-4 mb-4">
                  {activeData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 rounded-full border border-foreground/30 backdrop-blur-md text-xs font-medium bg-foreground/5 uppercase font-anta tracking-wider text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-6xl md:text-8xl font-abril font-medium leading-[1.1] tracking-tight text-foreground">
                  <span className="block text-accent italic text-4xl md:text-5xl mb-2 font-abril font-light">
                    {activeData.subtitle}
                  </span>
                  {activeData.title}
                </h1>

                <p className="max-w-xl text-lg text-foreground leading-relaxed mt-6 font-antonio">
                  {activeData.description}
                </p>

                <div className="flex items-center gap-6 mt-8">
                  <button className="group flex items-center justify-between gap-4 pl-6 pr-2 py-2 bg-white text-black rounded-full hover:bg-[#d4af37] transition-all duration-300">
                    <span className="font-semibold text-sm uppercase tracking-wide font-anta">
                      Discover Now
                    </span>
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </button>

                  {/* Mobile Navigation Controls (only visible on mobile) */}
                  <div className="flex md:hidden gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Floating Card - Dynamic Stats */}
          <div className="md:col-span-3">
            <motion.div
              key={activeData.id + "-stats"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-background/50 backdrop-blur-xl border border-background/50 p-4 rounded-2xl"
            >
              <div className="flex items-center gap-[-10px] mb-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background/50 overflow-hidden -ml-2 first:ml-0"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${
                        i + 10 + activeData.id
                      }`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background/50 bg-accent flex items-center justify-center -ml-2 text-xs text-background/50 font-anta font-bold">
                  {activeData.stats.travelers}
                </div>
              </div>
              <h3 className="text-lg font-abril font-medium mb-1 text-foreground/60">
                Happy Travelers
              </h3>
              <p className="text-xs text-antonio text-foreground/60 mb-4">
                Join our community of explorers in {activeData.country}.
              </p>
              <div className="flex items-center gap-2 text-accent font-anta">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold text-foreground">
                  {activeData.stats.rating}
                </span>
                <span className="text-xs text-gray-400">
                  ({activeData.stats.reviews})
                </span>
              </div>
            </motion.div>

            {/* Bottom floating image thumbnail of NEXT slide */}
            <div className="mt-6 hidden md:block">
              <p className="text-xs text-uppercase tracking-widest text-foreground mb-2">
                NEXT DESTINATION
              </p>
              <motion.div
                key={slides[(currentSlide + 1) % slides.length].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={nextSlide}
                className="rounded-2xl overflow-hidden h-32 relative group cursor-pointer border border-white/10"
              >
                <img
                  src={slides[(currentSlide + 1) % slides.length].image}
                  alt="Next"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-background/50 dark:bg-transparent transition-colors duration-500 group-hover:bg-transparent" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-antonio text-xl text-foreground drop-shadow-lg">
                    {slides[(currentSlide + 1) % slides.length].country}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
