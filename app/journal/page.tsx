import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

const JournalPage: React.FC = () => {
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
            <BookOpen size={28} className="text-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-anta font-bold text-foreground mb-4">
            Journal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-antonio">
            Stories, guides, and inspiration from travelers around the world. Discover new destinations and travel tips.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Featured article */}
          <article className="bg-card rounded-3xl overflow-hidden border border-border">
            <div className="aspect-[21/9] bg-muted" />
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-muted rounded-full text-xs font-bold text-foreground">
                  Featured
                </span>
                <span className="text-sm text-muted-foreground">
                  Jan 28, 2026
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-antonio">
                10 Hidden Gems to Visit in 2026
              </h2>
              <p className="text-muted-foreground mb-6 font-antonio leading-relaxed">
                Discover the most underrated destinations that should be on every traveler&apos;s bucket list this year. From secluded beaches to mountain retreats, these hidden gems offer authentic experiences away from the crowds.
              </p>
              <button className="text-foreground font-bold text-sm uppercase tracking-wider hover:underline">
                Read More
              </button>
            </div>
          </article>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <article
                key={i}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[16/9] bg-muted" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground">
                      Jan {20 + i}, 2026
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-antonio group-hover:text-muted-foreground transition-colors">
                    Travel Guide: Destination {i}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Everything you need to know before visiting this amazing destination...
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
