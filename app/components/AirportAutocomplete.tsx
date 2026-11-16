"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, X, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:3001/api/v1";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AirportOption {
  code: string;
  name: string;
  city: string;
  country: string;
  type: string;
}

interface Props {
  value: string;
  iataCode: string;
  onChange: (city: string, iataCode: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const AirportAutocomplete: React.FC<Props> = ({
  value,
  iataCode,
  onChange,
  placeholder = "City or airport code",
  required = false,
  className = "",
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AirportOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync when parent resets value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch from backend with debounce
  const fetchSuggestions = useCallback(async (keyword: string) => {
    if (keyword.trim().length < 1) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/flights/airports?keyword=${encodeURIComponent(keyword.trim())}`,
        { signal: abortRef.current.signal },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data: AirportOption[] = json.data || [];
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return; // cancelled — ignore
      setSuggestions([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setActiveIdx(-1);

    // Clear IATA selection while user types
    if (iataCode) onChange(q, "");

    // Debounce API call by 300 ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 300);
  };

  const selectOption = useCallback(
    (opt: AirportOption) => {
      const label = opt.city || opt.name;
      setQuery(label);
      setSuggestions([]);
      setOpen(false);
      setActiveIdx(-1);
      onChange(label, opt.code);
    },
    [onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx])
        selectOption(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onChange("", "");
    inputRef.current?.focus();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        {/* Left icon */}
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <MapPin size={15} />
          )}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
            else if (query.trim().length >= 1) fetchSuggestions(query);
          }}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          spellCheck={false}
          className="w-full pl-9 pr-16 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-shadow"
        />

        {/* IATA badge */}
        {iataCode && (
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded pointer-events-none select-none">
            {iataCode}
          </span>
        )}

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden"
        >
          {suggestions.map((opt, i) => (
            <li
              key={opt.code}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur before select
                selectOption(opt);
              }}
              className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors select-none ${
                i === activeIdx
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <div className="min-w-0">
                <span className="font-medium truncate block">
                  {opt.city || opt.name}
                </span>
                <span className="text-muted-foreground text-xs truncate block">
                  {opt.name !== (opt.city || opt.name) ? `${opt.name} · ` : ""}
                  {opt.country}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                {opt.type === "CITY" && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    city
                  </span>
                )}
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    i === activeIdx
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {opt.code}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportAutocomplete;
