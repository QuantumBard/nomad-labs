"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, MapPin, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublicListings } from "@/store/features/listings/listingsSlice";

const ExperiencesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: listings,
    loading,
    error,
  } = useAppSelector((state) => state.listings);

  useEffect(() => {
    dispatch(fetchPublicListings({ listingType: "Experience" }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
            <Compass size={28} className="text-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-anta font-bold text-foreground mb-4">
            Experiences
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-antonio">
            Discover unique activities and experiences hosted by locals. Make
            your trip unforgettable.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No experiences available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-4/3 bg-muted relative overflow-hidden">
                  {listing.photos?.[0] ? (
                    <img
                      src={listing.photos[0]}
                      alt={listing.public_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Compass size={40} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-background/90 rounded-full text-xs font-bold text-foreground">
                      {listing.listing_type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-2 font-antonio">
                    {listing.public_title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {listing.description || "No description available."}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <MapPin size={14} />
                    {listing.view_from_room || "Location not specified"}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                      ${listing.base_nightly_rate}/person
                    </span>
                    <button className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesPage;
