"use client";

import React from "react";
import {
  ArrowRight,
  MessageSquare,
  Heart,
  Eye,
  Clock,
  Calendar,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  image: string;
  readTime: string;
  views: string;
  date: string;
  category?: string;
  description?: string;
}

const articles: Article[] = [
  {
    id: 1,
    title:
      "India and China government opened Kailash Manas sarovar yatra from June",
    description:
      "The Kailash Manasarovar Yatra is known for its religious values, cultural significance, physical beauty and thrilling nature. This holy journey is undertaken by thousands of yatris every year.",
    image:
      "https://images.unsplash.com/photo-1544991337-95176b5233c4?q=80&w=1548&auto=format",
    category: "Pilgrimage",
    readTime: "5 min",
    views: "48,300",
    date: "14 Jun, 2025",
  },
  {
    id: 2,
    title: "Surviving the Antarctic: A guide to extreme cold expeditions",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image:
      "https://images.unsplash.com/photo-1509326066092-14b2e882fe86?q=80&w=1548",
    readTime: "3 min",
    views: "11,202",
    date: "12 May, 2024",
  },
  {
    id: 3,
    title: "Hidden gems of the Amazon Rainforest you must visit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image:
      "https://images.unsplash.com/photo-1591081658714-f576fb7ea3ed?q=80&w=1742",
    readTime: "3 min",
    views: "11,202",
    date: "22 May, 2024",
  },
  {
    id: 4,
    title: "The cultural depth of Kyoto's ancient shrines",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min",
    views: "11,202",
    date: "01 Sep, 2024",
  },
];

const featuredArticle = articles[0];
const popularArticles = articles.slice(1);

const JournalSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Featured Article Area (Info + Image) */}
          <div className="lg:col-span-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 md:gap-12 h-full">
            <div className="z-20 lg:w-1/2 space-y-8">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    className="w-14 h-14 rounded-full border-2 border-accent/20 group-hover:border-accent transition-colors"
                    alt="Author"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">
                    Farad Elia
                  </h4>
                  <p className="text-xs text-foreground/50 uppercase tracking-widest font-anta">
                    Digital creator
                  </p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-abril leading-[1.1] text-foreground">
                  {featuredArticle.title}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-foreground/20" />
                  <span className="text-xs font-anta uppercase tracking-widest text-foreground/40 italic">
                    {featuredArticle.category}
                  </span>
                </div>
                <p className="text-foreground/60 text-sm md:text-base font-antonio leading-relaxed max-w-sm">
                  {featuredArticle.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4">
                <div className="flex items-center gap-2 text-foreground/40">
                  <Eye size={16} />
                  <span className="text-xs font-anta font-medium uppercase tracking-wider">
                    {featuredArticle.views}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground/40">
                  <Clock size={16} />
                  <span className="text-xs font-anta font-medium uppercase tracking-wider">
                    {featuredArticle.readTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground/40">
                  <Calendar size={16} />
                  <span className="text-xs font-anta font-medium uppercase tracking-wider">
                    {featuredArticle.date}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button className="group relative px-8 md:px-10 py-3 md:py-4 bg-foreground/5 dark:bg-white/5 backdrop-blur-md rounded-xl font-anta uppercase text-xs tracking-widest font-bold border border-foreground/10 hover:border-accent transition-all hover:translate-x-1">
                  <span>Read More</span>
                  <ArrowRight
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 -rotate-45 group-hover:rotate-0 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="lg:w-1/2 relative group w-full">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none transform -rotate-2">
                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-6 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/20">
                  <span className="text-[10px] font-anta font-black uppercase tracking-[0.2em] text-foreground/80">
                    New Article
                  </span>
                </div>
              </div>

              <div className="aspect-[3/4] sm:aspect-[3/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-4 md:border-8 border-foreground/5 dark:border-white/5 shadow-2xl relative">
                <img
                  src={featuredArticle.image}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  alt="Featured"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-24 bg-foreground/10 dark:bg-white/10 rounded-full blur-xl" />
            </div>
          </div>

          {/* Right Column: Blog List */}
          <div className="lg:col-span-4 space-y-8 md:space-y-12 h-full flex flex-col justify-start">
            <div className="flex justify-between items-end border-b border-foreground/10 pb-4 md:pb-6">
              <h3 className="text-3xl md:text-4xl font-abril leading-none text-foreground">
                Our Blogs
              </h3>
              <div className="flex flex-col items-end">
                <span className="text-xs md:text-sm font-anta uppercase tracking-widest text-foreground/40 mb-1">
                  Popular Articles
                </span>
                <span className="text-xl md:text-2xl font-abril tracking-tighter">
                  1/5
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {popularArticles.map((article) => (
                <div
                  key={article.id}
                  className="group flex gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-glass border border-transparent hover:border-foreground/10 hover:bg-foreground/5 transition-all duration-500 cursor-pointer"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img
                      src={article.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                      alt={article.title}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="flex flex-col justify-between py-1">
                    <h4 className="font-anta font-bold text-xs md:text-sm leading-snug text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2">
                      {article.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-anta uppercase tracking-wider">
                        <Eye size={12} /> {article.views}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-anta uppercase tracking-wider">
                        <Clock size={12} /> {article.readTime}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-anta uppercase tracking-wider">
                        <Calendar size={12} /> {article.date}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button className="text-[10px] font-anta font-black uppercase tracking-widest px-3 py-1 bg-foreground text-background rounded-md hover:bg-accent hover:text-black transition-all">
                        Read More
                      </button>
                      <div className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                        <ArrowRight
                          size={14}
                          className="-rotate-45 group-hover:rotate-0 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
