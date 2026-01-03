"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const locations = [
  {
    name: "Bhutan",
    price: "2300$",
    duration: "5D4N",
    travellers: "30+",
    image:
      "https://images.unsplash.com/photo-1578556881786-851d4b79cb73?q=80&w=1740&auto=format",
    features: ["Tiger's Nest Hike", "Cultural Tour", "Dzongs Visit"],
  },
  {
    name: "Laos",
    price: "1300$",
    duration: "10D9N",
    travellers: "100+",
    image:
      "https://images.unsplash.com/photo-1610426714962-83caa2244105?q=80&w=1634&auto=format",
    features: ["Mekong Cruise", "Waterfall Trek", "Cave Exploration"],
  },
  {
    name: "Kolkata",
    price: "300$",
    duration: "3D2N",
    travellers: "40+",
    image:
      "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=800",
    features: ["Food Walk", "Heritage Tour", "Ghat Visit"],
  },
  {
    name: "Spiti",
    price: "800$",
    duration: "7D6N",
    travellers: "50+",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800",
    features: ["Monastery Tour", "Star Gazing", "Off-road Trip"],
  },
];

const AdventuresGrid: React.FC = () => {
  return (
    <section className="py-10 bg-background text-foreground overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-abril mb-2 text-foreground">
            Designing your adventures
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[600px]">
          {/* Left Large Card - Destination Planner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 bg-primary/90 backdrop-blur-md rounded-[40px] p-8 md:p-12 relative overflow-hidden group flex flex-col justify-between"
          >
            {/* Top Right Stepper */}
            <div className="absolute top-8 right-8 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-3 h-3 rounded-full bg-white" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>

            <div className="relative z-10 w-full">
              <h3 className="text-3xl font-abril mb-12 text-white uppercase tracking-wider leading-tight max-w-xs">
                Getting to know your{" "}
                <span className="text-accent font-abril italic">
                  DESTINATION
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Questions List */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-sm font-anta text-white/40 uppercase tracking-widest">
                      Primary Questions:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm font-antonio text-white/90">
                      <li>Collecting details of your trip.</li>
                      <li>Duration of the trip.</li>
                      <li>Number of people.</li>
                      <li>Budget of the trip.</li>
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-anta text-white/40 uppercase tracking-widest">
                      Secondary Questions:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm font-antonio text-white/50">
                      <li>Food preference if any.</li>
                      <li>Medical issues to discuss.</li>
                      <li>Activities you prefer.</li>
                    </ol>
                  </div>
                </div>

                {/* Image/Video Placeholder */}
                <div className="relative h-48 md:h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600"
                    alt="Planning"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Most Crafted Locations */}
          <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden">
            <div className="mb-8 pl-4">
              <h3 className="text-5xl md:text-6xl font-abril leading-none">
                Most <br />
                Crafted <br />
                Locations
              </h3>
            </div>

            {/* Auto Scrolling Carousel */}
            <div className="relative w-full h-[400px]">
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

              <div className="flex gap-6 overflow-hidden mask-linear-gradient">
                <motion.div
                  className="flex gap-6"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 30,
                  }}
                >
                  {[...locations, ...locations].map((loc, i) => (
                    <div
                      key={i}
                      className="relative w-[280px] h-[350px] flex-shrink-0 rounded-[30px] overflow-hidden group border border-foreground/10"
                    >
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                      />

                      {/* Price Tag Overlay */}
                      <div className="absolute top-0 right-0 p-4 z-20">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-bl-2xl rounded-tr-2xl">
                          <span className="text-2xl font-anta font-bold text-white items-start flex leading-none">
                            {loc.price}
                          </span>
                        </div>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                        <div className="mb-12">
                          <div className="flex justify-between items-end mb-2">
                            <h4 className="text-3xl font-abril text-white leading-none">
                              {loc.name}
                            </h4>
                            <span className="text-sm font-anta text-white/60 mb-1">
                              {loc.duration}
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {loc.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-[10px] text-white/80 font-antonio uppercase tracking-wide"
                              >
                                <div className="w-1 h-1 rounded-full bg-accent" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Traveller Badge */}
                      <div className="absolute bottom-0 right-0 z-20">
                        <div className="bg-[#2d4a3e] rounded-tl-[30px] px-6 py-4 flex flex-col items-center">
                          <span className="text-xl font-bold font-anta text-white leading-none mb-1">
                            {loc.travellers}
                          </span>
                          <span className="text-[8px] font-antonio uppercase tracking-widest text-white/60">
                            Travellers
                          </span>
                          <p className="text-[6px] text-white/40 max-w-[60px] text-center mt-1 leading-tight">
                            Lorem ipsum dolor sit amet
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdventuresGrid;
