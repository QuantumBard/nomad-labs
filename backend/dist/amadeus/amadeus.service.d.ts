import { ConfigService } from "@nestjs/config";
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
    code: string;
    name: string;
    city: string;
    country: string;
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
export declare class AmadeusService {
    private configService;
    private readonly logger;
    private amadeus;
    constructor(configService: ConfigService);
    searchFlights(params: SearchFlightParams): Promise<FlightOffer[]>;
    private transformFlightOffers;
    private getMockFlightData;
    getPriceAnalysis(originCode: string, destinationCode: string, departureDate: string): Promise<{
        averagePrice: number;
        minPrice: number;
        maxPrice: number;
        trend: string;
    }>;
    private getHeuristicPrice;
    searchAirports(keyword: string): Promise<AirportResult[]>;
    private getStaticAirports;
    getMonthlyAnalysis(origin: string, destination: string, yearMonth: string): Promise<{
        date: string;
        price: number;
    }[]>;
}
