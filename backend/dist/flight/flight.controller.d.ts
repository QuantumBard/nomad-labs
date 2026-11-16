import { FlightService } from "./flight.service";
import { SearchFlightsDto } from "./dto/search-flights.dto";
import { FlightOffer } from "../amadeus/amadeus.service";
export declare class FlightController {
    private readonly flightService;
    constructor(flightService: FlightService);
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
    searchAirports(keyword: string): Promise<{
        success: boolean;
        data: Array<{
            code: string;
            name: string;
            city: string;
            country: string;
            type: string;
        }>;
    }>;
    getMonthlyAnalysis(origin: string, destination: string, month: string): Promise<{
        success: boolean;
        data: {
            date: string;
            price: number;
        }[];
    }>;
}
