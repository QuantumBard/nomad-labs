import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Amadeus from "amadeus";

// Fallback airport list when Amadeus API credentials are not configured
const STATIC_AIRPORTS = [
  { code: "ATL", city: "Atlanta", country: "USA" },
  { code: "AMS", city: "Amsterdam", country: "Netherlands" },
  { code: "BCN", city: "Barcelona", country: "Spain" },
  { code: "BER", city: "Berlin", country: "Germany" },
  { code: "BKK", city: "Bangkok", country: "Thailand" },
  { code: "BLR", city: "Bengaluru", country: "India" },
  { code: "BOM", city: "Mumbai", country: "India" },
  { code: "BOS", city: "Boston", country: "USA" },
  { code: "BRU", city: "Brussels", country: "Belgium" },
  { code: "CAI", city: "Cairo", country: "Egypt" },
  { code: "CDG", city: "Paris Charles de Gaulle", country: "France" },
  { code: "CGK", city: "Jakarta", country: "Indonesia" },
  { code: "CLT", city: "Charlotte", country: "USA" },
  { code: "CPH", city: "Copenhagen", country: "Denmark" },
  { code: "CPT", city: "Cape Town", country: "South Africa" },
  { code: "DEL", city: "Delhi", country: "India" },
  { code: "DEN", city: "Denver", country: "USA" },
  { code: "DFW", city: "Dallas", country: "USA" },
  { code: "DOH", city: "Doha", country: "Qatar" },
  { code: "DPS", city: "Bali", country: "Indonesia" },
  { code: "DUB", city: "Dublin", country: "Ireland" },
  { code: "DXB", city: "Dubai", country: "UAE" },
  { code: "EWR", city: "Newark", country: "USA" },
  { code: "FCO", city: "Rome", country: "Italy" },
  { code: "FRA", city: "Frankfurt", country: "Germany" },
  { code: "GRU", city: "São Paulo", country: "Brazil" },
  { code: "GVA", city: "Geneva", country: "Switzerland" },
  { code: "HAN", city: "Hanoi", country: "Vietnam" },
  { code: "HEL", city: "Helsinki", country: "Finland" },
  { code: "HKG", city: "Hong Kong", country: "Hong Kong" },
  { code: "HND", city: "Tokyo Haneda", country: "Japan" },
  { code: "HNL", city: "Honolulu", country: "USA" },
  { code: "HYD", city: "Hyderabad", country: "India" },
  { code: "IAD", city: "Washington DC", country: "USA" },
  { code: "IAH", city: "Houston", country: "USA" },
  { code: "ICN", city: "Seoul", country: "South Korea" },
  { code: "IST", city: "Istanbul", country: "Turkey" },
  { code: "JED", city: "Jeddah", country: "Saudi Arabia" },
  { code: "JFK", city: "New York JFK", country: "USA" },
  { code: "JNB", city: "Johannesburg", country: "South Africa" },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "LAX", city: "Los Angeles", country: "USA" },
  { code: "LGW", city: "London Gatwick", country: "UK" },
  { code: "LHR", city: "London Heathrow", country: "UK" },
  { code: "LIM", city: "Lima", country: "Peru" },
  { code: "LIS", city: "Lisbon", country: "Portugal" },
  { code: "LOS", city: "Lagos", country: "Nigeria" },
  { code: "MAA", city: "Chennai", country: "India" },
  { code: "MAD", city: "Madrid", country: "Spain" },
  { code: "MAN", city: "Manchester", country: "UK" },
  { code: "MBA", city: "Mombasa", country: "Kenya" },
  { code: "MCO", city: "Orlando", country: "USA" },
  { code: "MEL", city: "Melbourne", country: "Australia" },
  { code: "MEX", city: "Mexico City", country: "Mexico" },
  { code: "MIA", city: "Miami", country: "USA" },
  { code: "MLE", city: "Malé", country: "Maldives" },
  { code: "MNL", city: "Manila", country: "Philippines" },
  { code: "MSP", city: "Minneapolis", country: "USA" },
  { code: "MUC", city: "Munich", country: "Germany" },
  { code: "MXP", city: "Milan", country: "Italy" },
  { code: "NBO", city: "Nairobi", country: "Kenya" },
  { code: "NRT", city: "Tokyo Narita", country: "Japan" },
  { code: "ORD", city: "Chicago", country: "USA" },
  { code: "ORY", city: "Paris Orly", country: "France" },
  { code: "OSL", city: "Oslo", country: "Norway" },
  { code: "PEK", city: "Beijing", country: "China" },
  { code: "PHL", city: "Philadelphia", country: "USA" },
  { code: "PRG", city: "Prague", country: "Czech Republic" },
  { code: "PVG", city: "Shanghai Pudong", country: "China" },
  { code: "RUH", city: "Riyadh", country: "Saudi Arabia" },
  { code: "SCL", city: "Santiago", country: "Chile" },
  { code: "SEA", city: "Seattle", country: "USA" },
  { code: "SFO", city: "San Francisco", country: "USA" },
  { code: "SIN", city: "Singapore", country: "Singapore" },
  { code: "SVO", city: "Moscow", country: "Russia" },
  { code: "SYD", city: "Sydney", country: "Australia" },
  { code: "TLV", city: "Tel Aviv", country: "Israel" },
  { code: "VIE", city: "Vienna", country: "Austria" },
  { code: "WAW", city: "Warsaw", country: "Poland" },
  { code: "YUL", city: "Montreal", country: "Canada" },
  { code: "YVR", city: "Vancouver", country: "Canada" },
  { code: "YYZ", city: "Toronto", country: "Canada" },
  { code: "ZRH", city: "Zurich", country: "Switzerland" },
];

export interface FlightOffer {
  id: string;
  source: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  currency: string;
  airline: string;
  flightNumber: string;
  duration: string;
  stops: number;
  departureTime: string;
  arrivalTime: string;
}

export interface AirportResult {
  code: string; // IATA e.g. "JFK"
  name: string; // e.g. "John F Kennedy International Airport"
  city: string; // e.g. "New York"
  country: string; // e.g. "United States"
  type: "AIRPORT" | "CITY";
}

export interface SearchFlightParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  currencyCode?: string;
}

@Injectable()
export class AmadeusService {
  private readonly logger = new Logger(AmadeusService.name);
  private amadeus: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("AMADEUS_API_KEY");
    const apiSecret = this.configService.get<string>("AMADEUS_API_SECRET");

    if (!apiKey || !apiSecret) {
      this.logger.warn(
        "Amadeus API credentials not configured. Using mock data.",
      );
    } else {
      this.amadeus = new Amadeus({
        clientId: apiKey,
        clientSecret: apiSecret,
      });
    }
  }

  async searchFlights(params: SearchFlightParams): Promise<FlightOffer[]> {
    try {
      if (!this.amadeus) {
        this.logger.log("Using mock flight data");
        return this.getMockFlightData(params);
      }

      const searchParams = {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults || 1,
        currencyCode: params.currencyCode || "USD",
        max: 20,
      };

      if (params.returnDate) {
        searchParams["returnDate"] = params.returnDate;
      }

      const startTime = Date.now();
      const response =
        await this.amadeus.shopping.flightOffersSearch.get(searchParams);
      const duration = Date.now() - startTime;

      this.logger.log(`Amadeus API call completed in ${duration}ms`);

      return this.transformFlightOffers(response.data);
    } catch (error) {
      this.logger.error("Error searching flights:", error.message);
      return this.getMockFlightData(params);
    }
  }

  private transformFlightOffers(data: any[]): FlightOffer[] {
    if (!Array.isArray(data)) return [];

    return data.map((offer, index) => {
      const itinerary = offer.itineraries[0];
      const segment = itinerary?.segments[0];

      const depTime = segment?.departure?.at ? new Date(segment.departure.at) : new Date();
      const arrTime = segment?.arrival?.at ? new Date(segment.arrival.at) : new Date();

      return {
        id: offer.id || `flight-${index}`,
        source: segment?.departure?.iataCode || "Unknown",
        destination: segment?.arrival?.iataCode || "Unknown",
        departureDate: segment?.departure?.at || new Date().toISOString(),
        returnDate: offer.itineraries[1]?.segments[0]?.departure?.at,
        price: parseFloat(offer.price?.total || 0),
        currency: offer.price?.currency || "USD",
        airline: segment?.carrierCode || "Unknown",
        flightNumber: `${segment?.carrierCode}${segment?.number}` || "Unknown",
        duration: itinerary?.duration || "Unknown",
        stops: (itinerary?.segments?.length || 1) - 1,
        departureTime: depTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        arrivalTime: arrTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
    });
  }

  private getMockFlightData(params: SearchFlightParams): FlightOffer[] {
    const airlines = [
      "SkyWings",
      "Global Air",
      "JetStream",
      "AirExpress",
      "FastFly",
    ];
    const basePrice = Math.floor(Math.random() * 300) + 150;

    return Array.from({ length: 5 }, (_, i) => {
      const priceVariation = Math.floor(Math.random() * 100) - 50;
      const departureDate = new Date(params.departureDate);
      departureDate.setHours(8 + i * 3, 0, 0, 0);
      
      const arrivalDate = new Date(departureDate);
      const hours = 4 + i;
      const mins = 30 + i * 10;
      arrivalDate.setHours(arrivalDate.getHours() + hours, arrivalDate.getMinutes() + mins);

      return {
        id: `mock-${i}`,
        source: params.originLocationCode,
        destination: params.destinationLocationCode,
        departureDate: departureDate.toISOString(),
        returnDate: params.returnDate,
        price: basePrice + priceVariation,
        currency: params.currencyCode || "USD",
        airline: airlines[i % airlines.length],
        flightNumber: `${airlines[i % airlines.length].substring(0, 2).toUpperCase()}${1000 + i}`,
        duration: `${4 + i}h ${30 + i * 10}m`,
        stops: i % 3 === 0 ? 0 : 1,
        departureTime: departureDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        arrivalTime: arrivalDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
    });
  }

  async getPriceAnalysis(
    originCode: string,
    destinationCode: string,
    departureDate: string,
  ): Promise<{
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    trend: string;
  }> {
    // ── Tier 1: Amadeus itineraryPriceMetrics (historical stats) ─────────────
    if (this.amadeus) {
      try {
        const res = await this.amadeus.analytics.itineraryPriceMetrics.get({
          originIataCode: originCode,
          destinationIataCode: destinationCode,
          departureDate,
          currencyCode: "USD",
          oneWay: true,
        });

        const metrics: { quartileRanking: string; amount: string }[] =
          res.data?.[0]?.priceMetrics || [];

        if (metrics.length >= 3) {
          const get = (rank: string) => {
            const m = metrics.find((m) => m.quartileRanking === rank);
            return m ? Math.round(parseFloat(m.amount)) : 0;
          };

          const min = get("MINIMUM");
          const median = get("MEDIAN");
          const max = get("MAXIMUM");
          const q1 = get("FIRST_QUARTILE");
          const q3 = get("THIRD_QUARTILE");

          if (median > 0) {
            this.logger.log(
              `[Tier 1] itineraryPriceMetrics: median=$${median} min=$${min} max=$${max}`,
            );
            // Trend: if current median is closer to max it's expensive → "up"
            const midpoint = (min + max) / 2;
            const trend = median > midpoint ? "up" : "down";
            return {
              averagePrice: median,
              minPrice: q1 || min, // Q1 is more practical "low" than absolute min
              maxPrice: q3 || max, // Q3 is more practical "high" than absolute max
              trend,
            };
          }
        }

        this.logger.log(
          "[Tier 1] No itineraryPriceMetrics data for this route — falling to Tier 2",
        );
      } catch (err: any) {
        this.logger.warn(
          `[Tier 1] itineraryPriceMetrics failed: ${err?.message || err} — falling to Tier 2`,
        );
      }
    }

    // ── Tier 2: Live flight search → average the returned fares ─────────────
    try {
      const flights = await this.searchFlights({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate,
        adults: 1,
        currencyCode: "USD",
      });

      if (flights.length > 0) {
        const prices = flights.map((f) => f.price).filter(Boolean);
        const average = Math.round(
          prices.reduce((a, b) => a + b, 0) / prices.length,
        );
        const min = Math.round(Math.min(...prices));
        const max = Math.round(Math.max(...prices));
        const midpoint = (min + max) / 2;
        const trend = average > midpoint ? "up" : "down";

        this.logger.log(
          `[Tier 2] Live search average: avg=$${average} min=$${min} max=$${max} (${flights.length} fares)`,
        );
        return { averagePrice: average, minPrice: min, maxPrice: max, trend };
      }

      this.logger.warn(
        "[Tier 2] No flight results — falling to Tier 3 heuristic",
      );
    } catch (err: any) {
      this.logger.warn(
        `[Tier 2] Live search failed: ${err?.message || err} — falling to Tier 3`,
      );
    }

    // ── Tier 3: Static heuristic (never returns 0) ────────────────────────
    this.logger.log(
      "[Tier 3] Using route-distance heuristic for price estimate",
    );
    return this.getHeuristicPrice(originCode, destinationCode);
  }

  /** Rough price heuristic based on known regions — avoids returning zeros.
   *  Values in USD. Override by setting up Amadeus API keys. */
  private getHeuristicPrice(
    originCode: string,
    destinationCode: string,
  ): {
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    trend: string;
  } {
    const combined = `${originCode}:${destinationCode}`.toUpperCase();
    // Very rough domestic-vs-intercontinental estimate
    const domesticPairs = /^(CCU|DEL|BOM|MAA|HYD|BLR|BLR|SIN|KUL|BKK|HKG)/;
    const isDomestic =
      originCode.slice(0, 1) === destinationCode.slice(0, 1) || // same first letter often same region
      domesticPairs.test(combined);

    const base = isDomestic ? 120 : 480;
    return {
      averagePrice: base,
      minPrice: Math.round(base * 0.7),
      maxPrice: Math.round(base * 1.4),
      trend: "up",
    };
  }

  async searchAirports(keyword: string): Promise<AirportResult[]> {
    if (!this.amadeus) {
      this.logger.log("No Amadeus key — returning static airport fallback");
      return this.getStaticAirports(keyword);
    }

    try {
      const response = await this.amadeus.referenceData.locations.get({
        keyword,
        subType: "AIRPORT,CITY",
        "page[limit]": 10,
        view: "LIGHT",
      });

      return (response.data || []).map((loc: any) => ({
        code: loc.iataCode,
        name: loc.name,
        city: loc.address?.cityName || loc.name,
        country: loc.address?.countryName || "",
        type: loc.subType as "AIRPORT" | "CITY",
      }));
    } catch (error) {
      this.logger.warn(
        "Amadeus airport search failed, using static fallback:",
        error.message,
      );
      return this.getStaticAirports(keyword);
    }
  }

  private getStaticAirports(keyword: string): AirportResult[] {
    const q = keyword.toLowerCase();
    return STATIC_AIRPORTS.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q),
    )
      .slice(0, 10)
      .map((a) => ({
        ...a,
        name: `${a.city} Airport`,
        type: "AIRPORT" as const,
      }));
  }

  async getMonthlyAnalysis(
    origin: string,
    destination: string,
    yearMonth: string, // YYYY-MM
  ): Promise<{ date: string; price: number }[]> {
    if (this.amadeus) {
      try {
        // Amadeus Flight Cheapest Date Search
        const response = await this.amadeus.shopping.flightDates.get({
          origin,
          destination,
          oneWay: true,
        });

        if (response.data && response.data.length > 0) {
          // Filter for the requested month and sort
          return response.data
            .filter((d: any) => d.departureDate.startsWith(yearMonth))
            .map((d: any) => ({
              date: d.departureDate,
              price: Math.round(parseFloat(d.price.total)),
            }))
            .sort((a: any, b: any) => a.date.localeCompare(b.date));
        }
      } catch (err) {
        this.logger.warn(
          "Cheapest date search failed, using mock monthly data:",
          err.message,
        );
      }
    }

    // Mock monthly data with variance
    const [year, month] = yearMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const basePrice = this.getHeuristicPrice(origin, destination).averagePrice;

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${yearMonth}-${day.toString().padStart(2, "0")}`;
      const d = new Date(year, month - 1, day);
      const isWeekend =
        d.getDay() === 0 || d.getDay() === 5 || d.getDay() === 6; // Fri, Sat, Sun are more expensive

      // Add weekend surge and some random fluctuations
      const weekendSurge = isWeekend ? 1.25 : 1.0;
      const randomFluc = 0.95 + Math.random() * 0.1; // +/- 5%

      // Middle of month is slightly cheaper usually
      const monthMidPoint = daysInMonth / 2;
      const proximityToMid = Math.abs(day - monthMidPoint) / monthMidPoint;
      const midMonthDiscount = 0.9 + proximityToMid * 0.1;

      return {
        date: dateStr,
        price: Math.round(
          basePrice * weekendSurge * randomFluc * midMonthDiscount,
        ),
      };
    });
  }
}
