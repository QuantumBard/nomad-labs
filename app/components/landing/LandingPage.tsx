"use client";

import React from "react";
import HeroSection from "./HeroSection";
import ManageWithProfessionals from "./ManageWithProfessionals";
import AdventuresGrid from "./AdventuresGrid";
import TripsGallery from "./TripsGallery";
import ExperienceGrid from "./ExperienceGrid";
import JournalSection from "./JournalSection";
import CommunitySection from "./CommunitySection";

const LandingPage: React.FC = () => {
  return (
    <main className="w-full min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-black">
      <HeroSection />
      {/* Placeholder for other sections to be enabled one by one */}
      <ManageWithProfessionals />
      <AdventuresGrid />
      <ExperienceGrid />
      <TripsGallery />
      <JournalSection />
      <CommunitySection />
    </main>
  );
};

export default LandingPage;
