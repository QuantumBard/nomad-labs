"use client";
import React, { useRef, useLayoutEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Stage } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rooms = [
  { name: "Deluxe Suite", price: "$450/night", color: "#C5A059" },
  { name: "Executive Villa", price: "$850/night", color: "#8B4513" },
  { name: "Presidential Loft", price: "$2200/night", color: "#4A4A4A" },
];

const ModelPlaceholder = ({ color }: { color: string }) => {
  return (
    <mesh>
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const RoomGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    let ctx = gsap.context(() => {
      let totalWidth = slider.scrollWidth - container.offsetWidth;

      gsap.to(slider, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => "+=" + totalWidth,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="h-screen bg-background text-foreground overflow-hidden flex flex-col justify-center"
    >
      <div className="container mx-auto px-6 mb-12">
        <span className="text-accent uppercase tracking-widest text-sm font-anta font-medium">
          Our Collection
        </span>
        <h2 className="font-abril text-4xl md:text-5xl mt-4">
          Curated Sanctuaries
        </h2>
      </div>

      <div ref={sliderRef} className="flex gap-12 px-6 w-max">
        {rooms.map((room, i) => (
          <div
            key={i}
            className="relative w-[80vw] md:w-[60vw] h-[60vh] bg-black/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl"
          >
            {/* 3D View - Left Half */}
            <div className="w-full md:w-1/2 h-full bg-gradient-to-br from-black to-zinc-900 relative">
              <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
                <Stage intensity={0.5} environment="city">
                  <ModelPlaceholder color={room.color} />
                </Stage>
              </Canvas>
              <div className="absolute bottom-6 left-6 pointer-events-none">
                <span className="bg-foreground/10 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase text-accent border border-accent/30 font-anta">
                  3D Tour Available
                </span>
              </div>
            </div>

            {/* Details - Right Half */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-glass">
              <h3 className="font-abril text-3xl md:text-4xl mb-4">
                {room.name}
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-8 font-antonio">
                Experience the epitome of luxury with panoramic views, bespoke
                furniture, and a private infinity pool. Designed for those who
                seek silence and style.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="block text-sm text-zinc-500 font-anta">
                    Starting from
                  </span>
                  <span className="text-2xl font-anta font-medium text-accent">
                    {room.price}
                  </span>
                </div>
                <button className="bg-foreground text-background px-6 py-3 rounded-full font-anta font-medium hover:bg-accent hover:text-black transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomGallery;
