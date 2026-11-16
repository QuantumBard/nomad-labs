import { PrismaService } from "../prisma/prisma.service";
import { AmadeusService, AirportResult, FlightOffer } from "../amadeus/amadeus.service";
import { SearchFlightsDto } from "./dto/search-flights.dto";
import { Redis } from "@upstash/redis";
export declare class FlightService {
    private readonly prisma;
    private readonly amadeusService;
    private readonly redis;
    private readonly logger;
    constructor(prisma: PrismaService, amadeusService: AmadeusService, redis: Redis | null);
    searchFlights(searchDto: SearchFlightsDto): Promise<{
        success: boolean;
        data: FlightOffer[];
        meta: {
            count: number;
            averagePrice: number;
            minPrice: number;
            maxPrice: number;
        };
    }>;
    getPriceAnalysis(origin: string, destination: string, date: string): Promise<{
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
    }>;
    getPopularRoutes(): Promise<{
        success: boolean;
        data: Array<{
            origin: string;
            destination: string;
            originCode: string;
            destinationCode: string;
            averagePrice: number;
            searchCount: number;
        }>;
    }>;
    private generateCacheKey;
    private logSearch;
    searchAirports(keyword: string): Promise<AirportResult[]>;
    getMonthlyAnalysis(origin: string, destination: string, yearMonth: string): Promise<{
        success: boolean;
        data: {
            date: string;
            price: number;
        }[];
    }>;
}
