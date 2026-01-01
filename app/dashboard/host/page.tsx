"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Home,
  Calendar,
  Settings,
  TrendingUp,
  Users,
  Plus,
  MoreVertical,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import NewListingDrawer from "../../components/dashboard/NewListingDrawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchListings } from "@/store/features/listings/listingsSlice";

const HostDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    items: listings,
    loading,
    error,
  } = useAppSelector((state) => state.listings);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchListings(user.id));
    }
  }, [user, dispatch]);

  const stats = [
    {
      label: "Total Revenue",
      value: "₹1,24,500",
      icon: TrendingUp,
      change: "+12.5%",
    },
    { label: "Active Bookings", value: "24", icon: Calendar, change: "+3" },
    { label: "Total Guests", value: "148", icon: Users, change: "+18" },
    { label: "Avg. Rating", value: "4.9", icon: Star, change: "0.1" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-white mb-2">
              Welcome back, {user?.displayName?.split(" ")[0]}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-light">
              Here's what's happening with your properties today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/?view=public")}
              className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              View Public Site
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
            >
              <Plus size={18} />
              <span>Add New Listing</span>
            </button>
          </div>
        </div>

        {/* New Listing Drawer */}
        <NewListingDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                  <stat.icon size={20} />
                </div>
                <span
                  className={`text-xs font-medium ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-zinc-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Your Listings
                </h2>
                <button className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  View All
                </button>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <div className="p-12 text-center text-zinc-500">
                    Loading your listings...
                  </div>
                ) : listings.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-zinc-500 mb-4">
                      You haven't added any listings yet.
                    </p>
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="text-sm font-medium text-zinc-900 dark:text-white hover:underline"
                    >
                      Create your first listing
                    </button>
                  </div>
                ) : (
                  listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="p-6 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                        {listing.photos?.[0] ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.public_title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Home className="text-zinc-400" size={24} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-zinc-900 dark:text-white truncate">
                          {listing.public_title}
                        </h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {listing.listing_type} • ₹{listing.base_nightly_rate}
                          /night
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                              listing.status === "Active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                            }`}
                          >
                            {listing.status}
                          </span>
                          <span className="text-[10px] text-zinc-400 uppercase font-medium">
                            {listing.total_inventory} units
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Analytics Graph Placeholder */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Performance Overview
                </h2>
                <select className="bg-zinc-50 dark:bg-zinc-800 border-none text-sm rounded-lg px-3 py-1 outline-none text-zinc-600 dark:text-zinc-400">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              {/* Minimalist SVG Graph */}
              <div className="h-64 w-full relative group">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 1000 200"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="currentColor"
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor="currentColor"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line
                    x1="0"
                    y1="50"
                    x2="1000"
                    y2="50"
                    stroke="currentColor"
                    strokeOpacity="0.05"
                  />
                  <line
                    x1="0"
                    y1="100"
                    x2="1000"
                    y2="100"
                    stroke="currentColor"
                    strokeOpacity="0.05"
                  />
                  <line
                    x1="0"
                    y1="150"
                    x2="1000"
                    y2="150"
                    stroke="currentColor"
                    strokeOpacity="0.05"
                  />

                  {/* Area */}
                  <path
                    d="M0,180 L100,140 L200,160 L300,100 L400,120 L500,60 L600,80 L700,40 L800,60 L900,20 L1000,40 L1000,200 L0,200 Z"
                    fill="url(#gradient)"
                    className="text-zinc-900 dark:text-white"
                  />
                  {/* Line */}
                  <path
                    d="M0,180 L100,140 L200,160 L300,100 L400,120 L500,60 L600,80 L700,40 L800,60 L900,20 L1000,40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-900 dark:text-white"
                  />
                  {/* Dots */}
                  {[
                    [0, 180],
                    [100, 140],
                    [200, 160],
                    [300, 100],
                    [400, 120],
                    [500, 60],
                    [600, 80],
                    [700, 40],
                    [800, 60],
                    [900, 20],
                    [1000, 40],
                  ].map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-white dark:fill-zinc-900 stroke-zinc-900 dark:stroke-white"
                      strokeWidth="2"
                    />
                  ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-4 text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <div className="bg-zinc-900 dark:bg-white p-8 rounded-3xl text-white dark:text-zinc-900">
              <h3 className="text-xl font-serif mb-4">Host Premium</h3>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-light mb-6 leading-relaxed">
                Unlock advanced analytics and priority support to grow your
                business faster.
              </p>
              <button className="w-full py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all">
                Upgrade Now
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    user: "Sarah M.",
                    action: "booked Alpine Zen",
                    time: "2h ago",
                  },
                  {
                    user: "James L.",
                    action: "left a 5-star review",
                    time: "5h ago",
                  },
                  {
                    user: "Alex K.",
                    action: "inquired about Urban Loft",
                    time: "8h ago",
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                      {activity.user[0]}
                    </div>
                    <div>
                      <p className="text-zinc-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-zinc-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
