"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const DualDashboard: React.FC = () => {
  const [isHost, setIsHost] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Animate the flip
    gsap.to(cardRef.current, {
      rotateY: isHost ? 180 : 0,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [isHost]);

  return (
    <section className="py-24 bg-[#0D0D0D] text-white flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl text-[#C5A059] mb-4">
          One Platform. <span className="text-white">Two Worlds.</span>
        </h2>
        <p className="text-white/60 text-lg">
          Switch between your journey and your business.
        </p>

        {/* Toggle Switch */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span
            className={`text-sm tracking-widest uppercase ${
              !isHost ? "text-[#C5A059]" : "text-zinc-500"
            }`}
          >
            Traveler
          </span>
          <button
            onClick={() => setIsHost(!isHost)}
            className="relative w-16 h-8 rounded-full bg-zinc-800 border border-zinc-700 transition-colors"
            aria-label="Toggle Dashboard View"
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-[#C5A059] transition-transform duration-300 ${
                isHost ? "translate-x-8" : ""
              }`}
            />
          </button>
          <span
            className={`text-sm tracking-widest uppercase ${
              isHost ? "text-[#C5A059]" : "text-zinc-500"
            }`}
          >
            Host
          </span>
        </div>
      </div>

      <div className="perspective-1000 w-full max-w-4xl px-4 h-[500px]">
        <div
          ref={cardRef}
          className="relative w-full h-full transform-style-3d shadow-2xl transition-all"
        >
          {/* TRAVELER FACE (Front) */}
          <div className="absolute inset-0 backface-hidden bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-9xl font-serif text-[#C5A059] transform translate-x-12 -translate-y-4">
              T
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-2xl font-semibold">Traveler Dashboard</h3>
                  <p className="text-zinc-400">Welcome back, Alex</p>
                </div>
                <div className="bg-[#C5A059]/20 text-[#C5A059] px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                  Gold Member
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-zinc-500 text-sm mb-2">Upcoming Trip</h4>
                  <p className="text-xl font-medium">Ubud, Bali</p>
                  <p className="text-xs text-zinc-400 mt-1">In 3 Days</p>
                </div>
                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-zinc-500 text-sm mb-2">Loyalty Points</h4>
                  <p className="text-xl font-medium text-[#C5A059]">12,450</p>
                  <p className="text-xs text-zinc-400 mt-1">pts available</p>
                </div>
                <div className="bg-black/30 p-6 rounded-2xl border border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="text-sm">Explore Stays &rarr;</span>
                </div>
              </div>
            </div>
          </div>

          {/* HOST FACE (Back) */}
          <div
            className="absolute inset-0 backface-hidden bg-zinc-900/80 backdrop-blur-md border border-[#C5A059]/30 rounded-3xl p-8 flex flex-col overflow-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 text-9xl font-serif text-zinc-500 transform translate-x-12 -translate-y-4">
              H
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    Host Analytics
                  </h3>
                  <p className="text-zinc-400">Property Performance</p>
                </div>
                <div className="bg-zinc-800 text-white px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                  Superhost
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-zinc-500 text-sm mb-2">
                    Monthly Revenue
                  </h4>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-medium text-[#C5A059]">
                      $12,850
                    </p>
                    <span className="text-green-500 text-sm mb-1">▲ 12%</span>
                  </div>
                </div>
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-zinc-500 text-sm mb-2">Occupancy Rate</h4>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-medium text-white">85%</p>
                    <span className="text-green-500 text-sm mb-1">▲ 5%</span>
                  </div>
                </div>
              </div>

              <div className="h-32 bg-zinc-950/30 rounded-xl flex items-end justify-between p-4 gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="w-full bg-[#C5A059]/40 hover:bg-[#C5A059] transition-colors rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualDashboard;
