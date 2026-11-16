import { Injectable, Logger, Inject, Optional } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  AmadeusService,
  AirportResult,
  FlightOffer,
  SearchFlightParams,
} from "../amadeus/amadeus.service";
import { SearchFlightsDto } from "./dto/search-flights.dto";
import { REDIS_CLIENT } from "../redis/redis.module";
import { Redis } from "@upstash/redis";

@Injectable()
export class FlightService {
  private readonly logger = new Logger(FlightService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly amadeusService: AmadeusService,
    @Optional() @Inject(REDIS_CLIENT) private readonly redis: Redis | null,
  ) {}

  async searchFlights(searchDto: SearchFlightsDto): Promise<{
    success: boolean;
    data: FlightOffer[];
    meta: {
      count: number;
      averagePrice: number;
      minPrice: number;
      maxPrice: number;
    };
  }> {
    const cacheKey = this.generateCacheKey(searchDto);

    // Try cache first (if Redis is configured)
    if (this.redis) {
      try {
        const cached = await this.redis.get<string>(cacheKey);
        if (cached) {
          this.logger.log("Returning cached flight results");
          const parsed = JSON.parse(cached);
          return {
            success: true,
            data: parsed.flights,
            meta: parsed.meta,
          };
        }
      } catch (error) {
        this.logger.warn("Redis cache error:", error.message);
      }
    }

    const searchParams: SearchFlightParams = {
      originLocationCode: searchDto.origin,
      destinationLocationCode: searchDto.destination,
      departureDate: searchDto.departureDate,
      returnDate: searchDto.returnDate,
      adults: searchDto.adults || 1,
      currencyCode: searchDto.currency || "USD",
    };

    const flights = await this.amadeusService.searchFlights(searchParams);

    // Calculate statistics
    const prices = flights.map((f) => f.price);
    const averagePrice =
      prices.length > 0
        ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const meta = {
      count: flights.length,
      averagePrice,
      minPrice,
      maxPrice,
    };

    // Cache for 5 minutes (if Redis is configured)
    if (this.redis) {
      try {
        await this.redis.setex(
          cacheKey,
          300,
          JSON.stringify({ flights, meta }),
        );
        this.logger.log("Flight results cached for 5 minutes");
      } catch (error) {
        this.logger.warn("Failed to cache flight results:", error.message);
      }
    }

    // Log search for analytics
    await this.logSearch(searchDto, meta);

    return {
      success: true,
      data: flights,
      meta,
    };
  }

  async getPriceAnalysis(
    origin: string,
    destination: string,
    date: string,
  ): Promise<{
    success: boolean;
    data: {
      averagePrice: number;
      minPrice: number;
      maxPrice: number;
      trend: string;
      recommendedTarget: number;
      bookingLinks?: {
        googleFlights: string;
        skyscanner: string;
        kayak: string;
        expedia: string;
        cheapoair: string;
      };
      offers?: Array<{
        id: string;
        airline: string;
        flightNumber: string;
        price: number;
        currency: string;
        duration: string;
        stops: number;
        departureTime: string;
        arrivalTime: string;
        bookingLinks: {
          googleFlights: string;
          skyscanner: string;
          kayak: string;
          expedia: string;
          cheapoair: string;
        };
      }>;
    };
  }> {
    const analysis = await this.amadeusService.getPriceAnalysis(
      origin,
      destination,
      date,
    );

    // Recommend target at 20% below average (user's requirement)
    const recommendedTarget = Math.round(analysis.averagePrice * 0.8);

    // Construct route-level booking links
    const skyDate = date.replace(/-/g, "").substring(2);
    const [yyyy, mm, dd] = date.split("-");
    const usDate = `${mm}/${dd}/${yyyy}`;

    const buildLinks = (org: string, dst: string) => ({
      googleFlights: `https://www.google.com/travel/flights?q=Flights%20to%20${dst}%20from%20${org}%20on%20${date}`,
      skyscanner: `https://www.skyscanner.net/transport/flights/${org.toLowerCase()}/${dst.toLowerCase()}/${skyDate}/`,
      kayak: `https://www.kayak.com/flights/${org}-${dst}/${date}?sort=price_a`,
      expedia: `https://www.expedia.com/Flights-Search?flight-type=on&mode=search&trip=oneway&leg1=from:${org},to:${dst},departure:${usDate}TANYT&passengers=adults:1`,
      cheapoair: `https://www.cheapoair.com/air/search?from=${org}&to=${dst}&depDate=${usDate}&adults=1&tripType=ONEWAY`,
    });

    const bookingLinks = buildLinks(origin, destination);

    // Fetch live flight offers to display as flight cards
    let offers: Array<{
      id: string;
      airline: string;
      flightNumber: string;
      price: number;
      currency: string;
      duration: string;
      stops: number;
      departureTime: string;
      arrivalTime: string;
      bookingLinks: ReturnType<typeof buildLinks>;
    }> = [];

    try {
      const flights = await this.amadeusService.searchFlights({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: 1,
        currencyCode: "USD",
      });

      offers = flights
        .sort((a, b) => a.price - b.price)
        .slice(0, 6)
        .map((f) => ({
          id: f.id,
          airline: f.airline,
          flightNumber: f.flightNumber,
          price: f.price,
          currency: f.currency || "USD",
          duration: f.duration || "",
          stops: f.stops ?? 0,
          departureTime: f.departureTime || "",
          arrivalTime: f.arrivalTime || "",
          bookingLinks: buildLinks(origin, destination),
        }));
    } catch {
      this.logger.warn("Could not fetch flight offers for flight cards");
    }

    return {
      success: true,
      data: {
        ...analysis,
        recommendedTarget,
        bookingLinks,
        offers,
      },
    };
  }

  async getPopularRoutes(): Promise<{
    success: boolean;
    data: Array<{
      origin: string;
      destination: string;
      originCode: string;
      destinationCode: string;
      averagePrice: number;
      searchCount: number;
    }>;
  }> {
    const popularRoutes = await this.prisma.$queryRaw`
      SELECT 
        source as origin,
        destination,
        source_code as "originCode",
        destination_code as "destinationCode",
        AVG(average_price)::float as "averagePrice",
        COUNT(*)::int as "searchCount"
      FROM flight_searches
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY source, destination, source_code, destination_code
      ORDER BY "searchCount" DESC
      LIMIT 10
    `;

    return {
      success: true,
      data: popularRoutes as any[],
    };
  }

  private generateCacheKey(dto: SearchFlightsDto): string {
    return `flights:${dto.origin}:${dto.destination}:${dto.departureDate}:${dto.returnDate || "one-way"}:${dto.adults || 1}`;
  }

  private async logSearch(dto: SearchFlightsDto, meta: any): Promise<void> {
    try {
      await this.prisma.flightSearch.create({
        data: {
          source: dto.origin,
          destination: dto.destination,
          sourceCode: dto.origin,
          destinationCode: dto.destination,
          departureDate: new Date(dto.departureDate),
          returnDate: dto.returnDate ? new Date(dto.returnDate) : null,
          adults: dto.adults || 1,
          currency: dto.currency || "USD",
          resultsCount: meta.count,
          averagePrice: meta.averagePrice,
          minPrice: meta.minPrice,
          maxPrice: meta.maxPrice,
        },
      });
    } catch (error) {
      this.logger.error("Failed to log search:", error.message);
    }
  }

  async searchAirports(keyword: string): Promise<AirportResult[]> {
    return this.amadeusService.searchAirports(keyword);
  }

  async getMonthlyAnalysis(
    origin: string,
    destination: string,
    yearMonth: string,
  ): Promise<{
    success: boolean;
    data: { date: string; price: number }[];
  }> {
    const data = await this.amadeusService.getMonthlyAnalysis(
      origin,
      destination,
      yearMonth,
    );

    return {
      success: true,
      data,
    };
  }
}
