"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { AirportAutocomplete } from "@/app/components/AirportAutocomplete";
import {
  ArrowLeft,
  Bell,
  Plus,
  Plane,
  Calendar,
  Clock,
  Trash2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Search,
  RefreshCw,
  CheckCircle2,
  BarChart2,
  X,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:3001/api/v1";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FareHistoryEntry {
  id: string;
  price: number;
  currency: string;
  recordedAt: string;
}

interface FlightReminder {
  id: string;
  userId: string;
  source: string;
  destination: string;
  sourceCode?: string;
  destinationCode?: string;
  startDate: string;
  endDate?: string;
  targetPrice: number;
  currentPrice?: number;
  isTriggered: boolean;
  status: "ACTIVE" | "TRIGGERED" | "EXPIRED" | "PAUSED";
  createdAt: string;
  triggeredAt?: string;
  fareHistory?: FareHistoryEntry[];
}

interface BookingLinks {
  googleFlights: string;
  skyscanner: string;
  kayak: string;
  expedia: string;
  cheapoair: string;
}

interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  price: number;
  currency?: string;
  duration: string;
  stops: number;
  departureTime?: string;
  arrivalTime?: string;
  bookingLinks?: BookingLinks;
}

interface PriceAnalysis {
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  trend: string;
  recommendedTarget: number;
  bookingLinks?: BookingLinks;
  offers?: FlightOffer[];
}

interface SearchForm {
  source: string;
  destination: string;
  sourceCode: string;
  destinationCode: string;
  startDate: string;
  endDate: string;
  targetPrice: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusColors: Record<string, string> = {
  ACTIVE: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  TRIGGERED:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  EXPIRED: "bg-muted text-muted-foreground",
  PAUSED:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
};

// ─── Component ───────────────────────────────────────────────────────────────

const RemindersPage: React.FC = () => {
  const { user } = useAuth();

  // Reminders list
  const [reminders, setReminders] = useState<FlightReminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "TRIGGERED">(
    "ALL",
  );

  // New reminder form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<SearchForm>({
    source: "",
    destination: "",
    sourceCode: "",
    destinationCode: "",
    startDate: "",
    endDate: "",
    targetPrice: "",
  });

  // Search / price analysis results
  const [searchResults, setSearchResults] = useState<FlightOffer[]>([]);
  const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis | null>(
    null,
  );
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Slider for drop percent (5-50)
  const [dropPercent, setDropPercent] = useState(20);
  // Expanded flight offer card id
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  // Monthly analysis
  const [monthlyData, setMonthlyData] = useState<
    { date: string; price: number }[] | null
  >(null);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  // Per-card loading states
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create reminder loading
  const [creating, setCreating] = useState(false);

  // ── Load reminders ────────────────────────────────────────────────────────
  const loadReminders = useCallback(async () => {
    if (!user) return;
    setLoadingReminders(true);
    try {
      const res = await fetch(`${API_BASE}/reminders?userId=${user.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setReminders(json.data || []);
    } catch (err) {
      console.error("Failed to load reminders:", err);
      setReminders([]);
    } finally {
      setLoadingReminders(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadReminders();
    } else {
      setLoadingReminders(false);
    }
  }, [user, loadReminders]);

  // ── Search flights + price analysis ──────────────────────────────────────
  const handleSearchFlights = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setSearchError(null);
    setPriceAnalysis(null);
    setSearchResults([]);

    const origin = formData.sourceCode.trim() || formData.source.trim();
    const destination =
      formData.destinationCode.trim() || formData.destination.trim();
    const date = formData.startDate;

    try {
      // Fetch price analysis only
      const analysisRes = await fetch(
        `${API_BASE}/flights/price-analysis?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}`,
      );

      if (!analysisRes.ok)
        throw new Error(`Analysis failed: HTTP ${analysisRes.status}`);

      const analysisJson = await analysisRes.json();

      setPriceAnalysis(analysisJson.data || null);

      // Fetch monthly analysis
      setLoadingMonthly(true);
      const yearMonth = date.substring(0, 7); // "YYYY-MM"
      const monthlyRes = await fetch(
        `${API_BASE}/flights/monthly-analysis?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&month=${yearMonth}`,
      );
      if (monthlyRes.ok) {
        const monthlyJson = await monthlyRes.json();
        setMonthlyData(monthlyJson.data || null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setSearchError(`Could not fetch average price: ${msg}`);
      console.error(err);
    } finally {
      setSearching(false);
      setLoadingMonthly(false);
    }
  };

  // ── Create reminder ───────────────────────────────────────────────────────
  const handleCreateReminder = async (discountPercent: number) => {
    if (!user || !priceAnalysis) return;
    setCreating(true);

    const targetPrice = Math.round(
      priceAnalysis.averagePrice * (1 - discountPercent / 100),
    );

    const body = {
      userId: user.id,
      source: formData.source || formData.sourceCode,
      destination: formData.destination || formData.destinationCode,
      sourceCode: formData.sourceCode || formData.source,
      destinationCode: formData.destinationCode || formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      targetPrice,
      discountThreshold: discountPercent,
    };

    try {
      const res = await fetch(`${API_BASE}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      // Reload full list so we get the backend-computed data
      await loadReminders();
      setShowForm(false);
      resetForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to create reminder: ${msg}`);
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // ── Delete reminder ───────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!user) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/reminders/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete reminder. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Manual price check ────────────────────────────────────────────────────
  const handleCheckNow = async (id: string) => {
    setCheckingId(id);
    try {
      const res = await fetch(`${API_BASE}/reminders/${id}/check`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // Update the card in-place
      setReminders((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                currentPrice: json.data.currentPrice,
                isTriggered: json.data.isTriggered,
                status: json.data.isTriggered ? "TRIGGERED" : r.status,
              }
            : r,
        ),
      );
    } catch (err) {
      console.error("Price check failed:", err);
      alert("Could not refresh price. Please try again.");
    } finally {
      setCheckingId(null);
    }
  };

  // ── Misc helpers ─────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      source: "",
      destination: "",
      sourceCode: "",
      destinationCode: "",
      startDate: "",
      endDate: "",
      targetPrice: "",
    });
    setSearchResults([]);
    setPriceAnalysis(null);
    setSearchError(null);
  };

  const filteredReminders = reminders.filter((r) => {
    if (activeTab === "ALL") return true;
    return r.status === activeTab;
  });

  const pctToTarget = (r: FlightReminder) => {
    if (!r.currentPrice) return null;
    const pct = Math.round(
      ((r.currentPrice - r.targetPrice) / r.currentPrice) * 100,
    );
    return pct;
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <Bell size={24} className="text-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-anta font-bold text-foreground mb-2">
              Flight Reminders
            </h1>
            <p className="text-muted-foreground font-antonio">
              Get notified when flight prices drop 20% below the average fare.
            </p>
          </div>

          {user && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? "Cancel" : "New Reminder"}
            </button>
          )}
        </div>

        {/* Auth gate */}
        {!user && (
          <div className="bg-card rounded-2xl p-8 text-center border border-border mb-12">
            <AlertCircle
              size={48}
              className="mx-auto mb-4 text-muted-foreground"
            />
            <h3 className="text-xl font-bold text-foreground mb-2 font-antonio">
              Sign in Required
            </h3>
            <p className="text-muted-foreground mb-4">
              Please sign in to create and manage flight reminders.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* ── New Reminder Form ───────────────────────────────────────────── */}
        <AnimatePresence>
          {showForm && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border mb-12 overflow-hidden"
            >
              <h2 className="text-xl font-bold text-foreground mb-6 font-antonio flex items-center gap-2">
                <Plane size={20} />
                Search Flights &amp; Set Reminder
              </h2>

              <form onSubmit={handleSearchFlights} className="space-y-6">
                {/* Row 1: Origin / Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      From
                    </label>
                    <AirportAutocomplete
                      value={formData.source}
                      iataCode={formData.sourceCode}
                      placeholder="e.g. New York, JFK, London…"
                      required
                      onChange={(city, code) =>
                        setFormData({
                          ...formData,
                          source: city,
                          sourceCode: code,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      To
                    </label>
                    <AirportAutocomplete
                      value={formData.destination}
                      iataCode={formData.destinationCode}
                      placeholder="e.g. Tokyo, SIN, Paris…"
                      required
                      onChange={(city, code) =>
                        setFormData({
                          ...formData,
                          destination: city,
                          destinationCode: code,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Row 2: Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar size={14} />
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar size={14} />
                      Return Date{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      min={
                        formData.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Search button */}
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full px-6 py-3 bg-foreground text-background text-sm font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {searching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      Fetching live prices…
                    </>
                  ) : (
                    <>
                      <BarChart2 size={18} />
                      Get Average Price
                    </>
                  )}
                </button>
              </form>

              {/* Search error */}
              {searchError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {searchError}
                </div>
              )}

              {/* ── Results / Price Panel ─────────────────────────────────── */}
              <AnimatePresence>
                {priceAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-8 pt-8 border-t border-border space-y-6"
                  >
                    {/* Price analysis card */}
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-antonio mb-4 flex items-center gap-2">
                        <BarChart2 size={18} />
                        Price Intelligence
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                          {
                            label: "Average",
                            value: priceAnalysis.averagePrice,
                            highlight: false,
                          },
                          {
                            label: "Lowest",
                            value: priceAnalysis.minPrice,
                            highlight: false,
                          },
                          {
                            label: "Highest",
                            value: priceAnalysis.maxPrice,
                            highlight: false,
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="bg-background rounded-xl border border-border p-4 text-center"
                          >
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              {label}
                            </p>
                            <p className="text-xl font-bold text-foreground">
                              ${value.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div
                        className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg w-fit ${
                          priceAnalysis.trend === "down"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {priceAnalysis.trend === "down" ? (
                          <TrendingDown size={14} />
                        ) : (
                          <TrendingUp size={14} />
                        )}
                        Prices trending{" "}
                        <strong>
                          {priceAnalysis.trend === "down" ? "down" : "up"}
                        </strong>
                      </div>

                      {/* Monthly Analysis Chart */}
                      {loadingMonthly ? (
                        <div className="bg-background rounded-xl border border-border p-8 text-center animate-pulse">
                          <BarChart2
                            className="mx-auto mb-2 text-muted-foreground opacity-20"
                            size={32}
                          />
                          <p className="text-xs text-muted-foreground">
                            Analysing monthly trends...
                          </p>
                        </div>
                      ) : (
                        monthlyData &&
                        monthlyData.length > 0 && (
                          <div className="bg-background rounded-xl border border-border p-6 mt-4">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h4 className="font-bold text-foreground">
                                  Monthly Fare Trends
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  Typical price range for this month
                                </p>
                              </div>
                              <div className="flex gap-4 text-[10px] uppercase font-bold tracking-wider">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                  <span>Lowest</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                  <span>Peak</span>
                                </div>
                              </div>
                            </div>

                            <div className="h-32 flex items-end gap-1">
                              {(() => {
                                const maxVal = Math.max(
                                  ...monthlyData.map((d) => d.price),
                                );
                                const minVal = Math.min(
                                  ...monthlyData.map((d) => d.price),
                                );
                                return monthlyData.map((d, i) => {
                                  const height = (d.price / maxVal) * 100;
                                  const isLowest = d.price === minVal;
                                  const isHighest = d.price === maxVal;

                                  return (
                                    <motion.div
                                      key={d.date}
                                      initial={{ height: 0 }}
                                      animate={{ height: `${height}%` }}
                                      className={`flex-1 rounded-t-[2px] relative group cursor-pointer transition-colors ${
                                        isLowest
                                          ? "bg-primary"
                                          : isHighest
                                            ? "bg-red-500/40"
                                            : "bg-muted-foreground/20 hover:bg-primary/30"
                                      }`}
                                    >
                                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                        {new Date(d.date).toLocaleDateString(
                                          undefined,
                                          { day: "numeric", month: "short" },
                                        )}
                                        : ${d.price}
                                      </div>
                                    </motion.div>
                                  );
                                });
                              })()}
                            </div>
                            <div className="flex justify-between mt-3 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                              <span>
                                {new Date(
                                  monthlyData[0].date,
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <div className="flex gap-2">
                                {/* Show some date markers if month is long */}
                                <span>15th</span>
                              </div>
                              <span>
                                {new Date(
                                  monthlyData[monthlyData.length - 1].date,
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        )
                      )}

                      {priceAnalysis.bookingLinks && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                          {[
                            {
                              name: "Google Flights",
                              url: priceAnalysis.bookingLinks.googleFlights,
                            },
                            {
                              name: "Skyscanner",
                              url: priceAnalysis.bookingLinks.skyscanner,
                            },
                            {
                              name: "Kayak",
                              url: priceAnalysis.bookingLinks.kayak,
                            },
                            {
                              name: "Expedia",
                              url: priceAnalysis.bookingLinks.expedia,
                            },
                            {
                              name: "CheapOair",
                              url: priceAnalysis.bookingLinks.cheapoair,
                            },
                          ].map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-background border border-border hover:border-primary hover:bg-primary/5 transition-colors rounded-xl p-3 flex items-center justify-between group"
                            >
                              <span className="text-sm font-bold text-foreground">
                                {link.name}
                              </span>
                              <ExternalLink
                                size={16}
                                className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Set alert panel — slider */}
                    <div className="bg-muted rounded-xl p-6">
                      <div className="flex items-start gap-3 mb-5">
                        <TrendingDown
                          size={20}
                          className="text-primary mt-0.5"
                        />
                        <div>
                          <h4 className="font-bold text-foreground mb-1">
                            Choose Target Drop
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Drag the slider to set how far the price must fall
                            before we alert you.
                          </p>
                        </div>
                      </div>

                      {/* Slider */}
                      <div className="space-y-3">
                        <input
                          type="range"
                          min={5}
                          max={90}
                          step={1}
                          value={dropPercent}
                          onChange={(e) =>
                            setDropPercent(Number(e.target.value))
                          }
                          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5%</span>
                          <span>90%</span>
                        </div>

                        {/* Live label */}
                        <div className="bg-background border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            At{" "}
                            <strong className="text-foreground">
                              {dropPercent}% drop
                            </strong>
                            , alert when below
                          </span>
                          <span className="text-xl font-bold text-foreground">
                            $
                            {Math.round(
                              priceAnalysis.averagePrice *
                                (1 - dropPercent / 100),
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCreateReminder(dropPercent)}
                        disabled={creating}
                        className="w-full mt-4 px-6 py-3 bg-foreground text-background text-sm font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {creating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Bell size={16} />
                            Set Price Alert
                          </>
                        )}
                      </button>
                    </div>

                    {/* ── Live Flight Cards ─────────────────────────── */}
                    {priceAnalysis.offers &&
                      priceAnalysis.offers.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-foreground font-antonio flex items-center gap-2">
                            <Plane size={18} />
                            Cheapest Flights
                          </h3>
                          {priceAnalysis.offers.map((offer) => (
                            <div
                              key={offer.id}
                              className="border border-border rounded-xl overflow-hidden"
                            >
                              <button
                                onClick={() =>
                                  setExpandedOffer(
                                    expandedOffer === offer.id
                                      ? null
                                      : offer.id,
                                  )
                                }
                                className="w-full flex items-center justify-between p-4 bg-background hover:bg-muted/50 transition-colors text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Plane size={14} className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-foreground">
                                      {offer.airline}
                                      {offer.flightNumber
                                        ? ` ${offer.flightNumber}`
                                        : ""}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {offer.departureTime && offer.arrivalTime
                                        ? `${offer.departureTime} → ${offer.arrivalTime}`
                                        : ""}
                                      {offer.duration
                                        ? ` · ${offer.duration}`
                                        : "Non-stop"}
                                      {offer.stops > 0
                                        ? ` · ${offer.stops} stop${offer.stops > 1 ? "s" : ""}`
                                        : " · Direct"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xl font-bold text-foreground">
                                    ${offer.price.toLocaleString()}
                                  </span>
                                  <span
                                    className={`text-muted-foreground transition-transform duration-200 ${
                                      expandedOffer === offer.id
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  >
                                    ▾
                                  </span>
                                </div>
                              </button>

                              <AnimatePresence>
                                {expandedOffer === offer.id &&
                                  offer.bookingLinks && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-muted border-t border-border">
                                        {[
                                          {
                                            name: "Google Flights",
                                            url: offer.bookingLinks
                                              .googleFlights,
                                          },
                                          {
                                            name: "Skyscanner",
                                            url: offer.bookingLinks.skyscanner,
                                          },
                                          {
                                            name: "Kayak",
                                            url: offer.bookingLinks.kayak,
                                          },
                                          {
                                            name: "Expedia",
                                            url: offer.bookingLinks.expedia,
                                          },
                                          {
                                            name: "CheapOair",
                                            url: offer.bookingLinks.cheapoair,
                                          },
                                        ].map((link) => (
                                          <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-background border border-border hover:border-primary hover:bg-primary/5 transition-colors rounded-lg p-2.5 flex items-center justify-between group text-xs"
                                          >
                                            <span className="font-bold text-foreground">
                                              {link.name}
                                            </span>
                                            <ExternalLink
                                              size={12}
                                              className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-1"
                                            />
                                          </a>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Reminders Dashboard ───────────────────────────────────────────── */}
        {user && (
          <div>
            {/* Tab bar */}
            <div className="flex items-center gap-6 mb-6 border-b border-border">
              {(["ALL", "ACTIVE", "TRIGGERED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === tab
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "ALL"
                    ? "All"
                    : tab.charAt(0) + tab.slice(1).toLowerCase()}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            {loadingReminders ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Clock
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-xl font-bold text-foreground mb-2 font-antonio">
                  No Reminders
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "ALL"
                    ? "Create your first flight price alert to get started."
                    : `No ${activeTab.toLowerCase()} reminders.`}
                </p>
                {activeTab === "ALL" && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Plus size={18} />
                    New Reminder
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredReminders.map((reminder) => {
                    const pct = pctToTarget(reminder);
                    const isBelow = pct !== null && pct <= 0;

                    return (
                      <motion.div
                        key={reminder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        className={`bg-card rounded-2xl p-6 border transition-all hover:shadow-lg flex flex-col gap-4 ${
                          reminder.status === "TRIGGERED"
                            ? "border-green-500 shadow-green-500/10"
                            : "border-border"
                        }`}
                      >
                        {/* Card header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Plane
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                statusColors[reminder.status] ??
                                statusColors.ACTIVE
                              }`}
                            >
                              {reminder.status.charAt(0) +
                                reminder.status.slice(1).toLowerCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Refresh button */}
                            <button
                              onClick={() => handleCheckNow(reminder.id)}
                              disabled={checkingId === reminder.id}
                              title="Check current price"
                              className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                            >
                              <RefreshCw
                                size={14}
                                className={
                                  checkingId === reminder.id
                                    ? "animate-spin"
                                    : ""
                                }
                              />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(reminder.id)}
                              disabled={deletingId === reminder.id}
                              title="Delete reminder"
                              className="p-2 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                            >
                              {deletingId === reminder.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Route */}
                        <div>
                          <div className="flex items-center gap-2 text-lg font-bold text-foreground mb-0.5">
                            <span>
                              {reminder.sourceCode || reminder.source}
                            </span>
                            <span className="text-muted-foreground text-base">
                              →
                            </span>
                            <span>
                              {reminder.destinationCode || reminder.destination}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {reminder.source} → {reminder.destination}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {fmtDate(reminder.startDate)}
                            {reminder.endDate &&
                              ` — ${fmtDate(reminder.endDate)}`}
                          </p>
                        </div>

                        {/* Price info */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Current Price
                            </span>
                            <span className="font-bold text-foreground">
                              {reminder.currentPrice
                                ? `$${reminder.currentPrice.toLocaleString()}`
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Target Price
                            </span>
                            <span className="font-bold text-green-600">
                              ${reminder.targetPrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Progress bar */}
                          {reminder.currentPrice && pct !== null && (
                            <div className="pt-2">
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-muted-foreground">
                                  {isBelow
                                    ? "✓ Target reached!"
                                    : `${pct}% above target`}
                                </span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isBelow ? "bg-green-500" : "bg-blue-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.max(5, 100 - pct))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Fare history */}
                        {reminder.fareHistory &&
                          reminder.fareHistory.length > 0 && (
                            <div className="pt-3 border-t border-border">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                Recent Prices
                              </p>
                              <div className="flex items-end gap-1.5">
                                {reminder.fareHistory.slice(0, 5).map((h) => (
                                  <div
                                    key={h.id}
                                    title={`$${h.price} on ${fmtDate(h.recordedAt)}`}
                                    className="flex-1 bg-muted rounded-sm text-center"
                                    style={{
                                      height: `${Math.max(
                                        8,
                                        Math.round(
                                          (h.price /
                                            Math.max(
                                              ...reminder.fareHistory!.map(
                                                (x) => x.price,
                                              ),
                                            )) *
                                            32,
                                        ),
                                      )}px`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Triggered CTA */}
                        {reminder.status === "TRIGGERED" && (
                          <div className="flex items-center gap-2 text-green-600 text-sm font-bold pt-1">
                            <CheckCircle2 size={16} />
                            Price target hit! Book now.
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPage;
