"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Users,
  Calendar,
  Settings2,
  ArrowRight,
  Star,
  Quote,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const agencies = [
  {
    name: "Travel Troopers",
    color: "from-[#ffffff] to-[#000000]",
    image:
      "https://images.unsplash.com/photo-1766859813732-20a127bb6023?auto=format&fit=crop&q=80&w=1200",
    plans: ["Desert Safari", "Valley Trekking", "VIP Camp"],
    reviews: { rating: 4.9, count: 850 },
    icon: (
      <div className="w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    ),
  },
  {
    name: "Trip with Nomads",
    color: "from-[#ffffff] to-[#000000]",
    image:
      "https://images.unsplash.com/photo-1518203441944-e9578e4b1635?auto=format&fit=crop&q=80&w=1200",
    plans: ["Nomad Living", "Stargazing Night", "Cultural Walk"],
    reviews: { rating: 4.8, count: 620 },
    icon: (
      <div className="w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M12 2.1L1 7l11 4.9L23 7l-11-4.9zM1 12l11 4.9L23 12M1 17l11 4.9L23 17" />
        </svg>
      </div>
    ),
  },
  {
    name: "Soul Trips",
    color: "from-[#ffffff] to-[#000000]",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=1200",
    plans: ["Spiritual Retreat", "Yoga in Wild", "Silent Hike"],
    reviews: { rating: 4.7, count: 430 },
    icon: (
      <div className="w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Rakshit Travels",
    color: "from-[#000033] to-[#000066]",
    icon: (
      <div className="w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Travel Yatri",
    color: "from-[#333333] to-[#000000]",
    icon: (
      <div className="w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.43c-.16.09-.33.14-.5.14s-.34-.05-.5-.14l-7.97-4.43c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.43c.16-.09.33-.14.5-.14s.34.05.5.14l7.97 4.43c.32.17.53.5.53.88v9z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Musafir Travels",
    color: "from-[#006600] to-[#003300]",
    icon: (
      <div className="w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    ),
  },
];

const managers = [
  {
    name: "Marcus Thorne",
    bio: "Off-grid survivalist and high-altitude trek specialist.",
    specialties: ["Trek", "Survival"],
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Sofia Chen",
    bio: "Visual storyteller capturing deep cultural narratives.",
    specialties: ["Cultural", "Cinematics"],
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Julian Vane",
    bio: "Urban pulse explorer and architectural photographer.",
    specialties: ["Trip", "Photography"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Elena Kurtz",
    bio: "Deep forest guide and primitive skills instructor.",
    specialties: ["Trek", "Nature"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Kaito Honda",
    bio: "Cinematic drone pilot and expedition documentarian.",
    specialties: ["Cinematics", "Trip"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
  },
];

const smoothTransition = {
  type: "tween" as const,
  ease: [0.43, 0.13, 0.23, 0.96] as const,
  duration: 0.8,
};

const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      ...smoothTransition,
    },
  }),
};

const ManageWithProfessionals: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Hotels");
  const [currentAgencyIndex, setCurrentAgencyIndex] = useState(0);
  const featuredAgencies = agencies.slice(0, 3);

  const nextAgency = () => {
    setCurrentAgencyIndex((prev) => (prev + 1) % featuredAgencies.length);
  };

  const prevAgency = () => {
    setCurrentAgencyIndex(
      (prev) => (prev - 1 + featuredAgencies.length) % featuredAgencies.length
    );
  };

  return (
    <section className="relative w-full min-h-screen bg-background text-foreground overflow-hidden py-20 px-4 md:px-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1765706730202-d8ec6a18ecfa?auto=format&fit=crop&q=80&w=2560"
          alt="Mountains"
          className="w-full h-full object-cover opacity-60 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Main Search UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Decorative Box */}
          <div className="lg:col-span-3 hidden lg:block">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={staggerVariants}
              className="aspect-square rounded-3xl bg-foreground/50 backdrop-blur-xl flex items-center justify-center p-8 overflow-hidden relative"
            >
              <div className="absolute top-4 left-4 border-t-2 border-l-2 border-background/40 w-8 h-8" />
              <div className="absolute top-4 right-4 border-t-2 border-r-2 border-background/40 w-8 h-8" />
              <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-background/40 w-8 h-8" />
              <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-background/40 w-8 h-8" />

              <div className="flex flex-col items-center gap-2">
                {[85, 65, 90, 75, 95].map((width, i) => (
                  <div
                    key={`top-${i}`}
                    className="h-1 w-24 bg-foreground/20 rounded-full"
                    style={{ width: `${width}%` }}
                  />
                ))}
                <div className="h-12 w-1 bg-foreground/40 rounded-full my-2" />
                {[70, 92, 80, 60, 88].map((width, i) => (
                  <div
                    key={`bottom-${i}`}
                    className="h-1 w-24 bg-foreground/20 rounded-full"
                    style={{ width: `${width}%` }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Center Search Card */}
          <div className="lg:col-span-6">
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={staggerVariants}
              className="bg-foreground/10 backdrop-blur-2xl p-8 rounded-[40px] shadow-2xl"
            >
              {/* Tabs */}
              <div className="flex gap-2 mb-8 bg-foreground/20 p-1 rounded-full w-fit">
                {["Hotels", "Tickets", "Info", "Trips"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-xs font-anta transition-all ${
                      activeTab === tab
                        ? "bg-white text-black shadow-lg"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {/* Location */}
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1 font-anta">
                    Location:
                  </p>
                  <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-lg font-antonio font-medium">
                      Nubra Valley, Ladakh
                    </span>
                  </div>
                </div>

                {/* Members */}
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1 font-anta">
                    Members:
                  </p>
                  <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-lg font-antonio font-medium">
                      3M, 3F, 2C
                    </span>
                    <Settings2 size={18} className="text-white/40" />
                  </div>
                </div>

                {/* Arrival & Departure */}
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1 font-anta">
                    Arrival & Departure
                  </p>
                  <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-12">
                    <div className="flex flex-col">
                      <span className="text-xl font-antonio font-bold">
                        05 NOV, 25
                      </span>
                      <span className="text-[10px] text-white/40 uppercase">
                        Saturday
                      </span>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-xl font-antonio font-bold">
                        07 NOV, 25
                      </span>
                      <span className="text-[10px] text-white/40 uppercase">
                        Monday
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-8 flex justify-end">
                <button className="group flex items-center gap-4 pl-8 pr-2 py-2 bg-[#1A1A1A] text-white rounded-full hover:bg-accent transition-all duration-300">
                  <span className="text-sm font-anta uppercase tracking-widest">
                    Search {activeTab}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Content */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={staggerVariants}
              className="bg-foreground/50 backdrop-blur-xl p-4 rounded-3xl relative overflow-hidden group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                <span className="text-[10px] font-anta tracking-widest uppercase text-white/60">
                  Journey of Hotels
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=400"
                className="w-full h-32 object-cover rounded-2xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500"
                alt="Hotel"
              />
              <p className="text-xs text-white/70 font-antonio leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor.
              </p>
            </motion.div>

            <div className="flex justify-end">
              <div className="px-4 py-2 rounded-full bg-foreground/50 backdrop-blur-md flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <MapPin size={12} className="text-white" />
                </div>
                <span className="text-[10px] font-anta tracking-tighter text-white">
                  BEYOND IMAGINATION
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Agency Section */}
        <div className="pt-10">
          <h2 className="text-5xl md:text-7xl font-abril tracking-tighter text-foreground mb-12 uppercase">
            Manage Trips with Professionals
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
            {/* Left Large Card Carousel - Featured Agencies */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 rounded-[40px] bg-foreground text-background relative overflow-hidden group shadow-2xl flex flex-col"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAgencyIndex}
                  initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  transition={smoothTransition}
                  className="absolute inset-0"
                >
                  <img
                    src={featuredAgencies[currentAgencyIndex].image}
                    className="w-full h-full object-cover opacity-50 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                    alt={featuredAgencies[currentAgencyIndex].name}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${featuredAgencies[currentAgencyIndex].color} mix-blend-multiply opacity-40`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="relative z-10 h-full flex flex-col justify-between p-12">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-background/20 backdrop-blur-md">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentAgencyIndex}
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        transition={smoothTransition}
                      >
                        {/* We need the icons to be visible on the inverted bg */}
                        <div className="[&_svg]:fill-background [&_svg]:text-background">
                          {featuredAgencies[currentAgencyIndex].icon}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={prevAgency}
                      className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextAgency}
                      className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentAgencyIndex}
                      initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                      transition={{ ...smoothTransition, duration: 0.6 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={
                                i <
                                Math.floor(
                                  featuredAgencies[currentAgencyIndex].reviews
                                    ?.rating || 0
                                )
                                  ? "currentColor"
                                  : "none"
                              }
                              className={
                                i <
                                Math.floor(
                                  featuredAgencies[currentAgencyIndex].reviews
                                    ?.rating || 0
                                )
                                  ? ""
                                  : "opacity-20"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs font-anta opacity-60">
                          ({featuredAgencies[currentAgencyIndex].reviews?.count}{" "}
                          Reviews)
                        </span>
                      </div>

                      <h3 className="text-4xl md:text-5xl font-anta font-black mb-6 uppercase tracking-tight leading-none text-background">
                        {featuredAgencies[currentAgencyIndex].name}
                      </h3>

                      <div className="flex flex-wrap gap-3 mb-8">
                        {featuredAgencies[currentAgencyIndex].plans?.map(
                          (plan, i) => (
                            <span
                              key={i}
                              className="px-4 py-1.5 rounded-full bg-background/20 backdrop-blur-md text-[10px] font-anta uppercase tracking-widest text-background"
                            >
                              {plan}
                            </span>
                          )
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between">
                  <button className="group flex items-center gap-4 pl-8 pr-2 py-2 bg-background text-foreground rounded-full hover:bg-accent hover:text-background transition-all duration-300 w-fit">
                    <span className="text-sm font-anta uppercase tracking-widest font-bold">
                      Discover Plans
                    </span>
                    <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-background/20 transition-colors">
                      <ArrowRight size={20} />
                    </div>
                  </button>

                  <div className="flex gap-1">
                    {featuredAgencies.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 transition-all duration-300 rounded-full ${
                          i === currentAgencyIndex
                            ? "w-8 bg-foreground"
                            : "w-2 bg-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Grid - Other Agencies */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              {/* Text/Intro Block */}
              <div className="col-span-2 md:col-span-1 flex flex-col justify-center p-6">
                <h3 className="text-5xl font-abril font-normal uppercase text-foreground leading-none">
                  Small <br />
                  <span className="text-foreground/60 italic">
                    Managers
                  </span>{" "}
                  <br />
                  Personal <br />
                  Touch
                </h3>
              </div>
              {/* Top Right Card */}
              {/* Top Right Card - Manager 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="col-span-2 md:col-span-1 rounded-[32px] bg-background/50 backdrop-blur-xl p-8 relative group overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <img
                    src={managers[0].image}
                    className="w-full h-full object-cover grayscale rounded-bl-[100px]"
                    alt={managers[0].name}
                  />
                </div>
                <div className="relative z-10 pt-12">
                  <h3 className="text-2xl font-abril text-foreground mb-2">
                    {managers[0].name}
                  </h3>
                  <p className="text-xs text-foreground/80 font-antonio leading-relaxed mb-4 max-w-[80%]">
                    {managers[0].bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {managers[0].specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-anta uppercase tracking-widest px-2 py-1 bg-foreground/5 rounded-full text-foreground/70"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-anta uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors cursor-pointer">
                  <span>View Profile</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
              {/* Bottom Left Card - Manager 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="col-span-2 md:col-span-1 rounded-[32px] bg-background/50 backdrop-blur-xl p-8 relative group overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <img
                    src={managers[1].image}
                    className="w-full h-full object-cover grayscale rounded-bl-[100px]"
                    alt={managers[1].name}
                  />
                </div>
                <div className="relative z-10 pt-12">
                  <h3 className="text-2xl font-abril text-foreground mb-2">
                    {managers[1].name}
                  </h3>
                  <p className="text-xs text-foreground/80 font-antonio leading-relaxed mb-4 max-w-[80%]">
                    {managers[1].bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {managers[1].specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-anta uppercase tracking-widest px-2 py-1 bg-foreground/5 rounded-full text-foreground/70"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-anta uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors cursor-pointer">
                  <span>Explore Trips</span>
                  <ArrowRight size={14} />
                </div>
              </motion.div>
              {/* Bottom Right Card - Grid of Managers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="col-span-2 md:col-span-1 bg-background rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 relative group overflow-hidden flex flex-col items-center justify-center text-center gap-6 cursor-pointer"
              >
                <div className="grid grid-cols-3 gap-3">
                  {managers.slice(2).map((manager, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full overflow-hidden grayscale-[50%] hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-100"
                    >
                      <img
                        src={manager.image}
                        alt={manager.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-abril text-xl text-foreground mb-1">
                    Meet {managers.length - 2} More
                  </p>
                  <p className="font-anta text-[10px] uppercase tracking-widest text-foreground/40">
                    Independent Experts
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <ArrowRight size={20} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageWithProfessionals;
