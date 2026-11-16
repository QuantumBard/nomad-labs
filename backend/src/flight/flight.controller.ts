import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { FlightService } from "./flight.service";
import { SearchFlightsDto } from "./dto/search-flights.dto";
import { FlightOffer } from "../amadeus/amadeus.service";

@ApiTags("Flights")
@Controller("flights")
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get("search")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: "Search for flights" })
  async searchFlights(@Query() searchDto: SearchFlightsDto): Promise<{
    success: boolean;
    data: FlightOffer[];
    meta: {
      count: number;
      averagePrice: number;
      minPrice: number;
      maxPrice: number;
    };
  }> {
    return this.flightService.searchFlights(searchDto);
  }

  @Get("price-analysis")
  @ApiOperation({ summary: "Get price analysis for a route" })
  async getPriceAnalysis(
    @Query("origin") origin: string,
    @Query("destination") destination: string,
    @Query("date") date: string,
  ): Promise<{
    success: boolean;
    data: {
      averagePrice: number;
      minPrice: number;
      maxPrice: number;
      trend: string;
      recommendedTarget: number;
    };
  }> {
    return this.flightService.getPriceAnalysis(origin, destination, date);
  }

  @Get("popular-routes")
  @ApiOperation({ summary: "Get popular flight routes" })
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
    return this.flightService.getPopularRoutes();
  }

  @Get("airports")
  @ApiOperation({
    summary: "Search airports and cities by keyword (uses Amadeus API)",
  })
  async searchAirports(@Query("keyword") keyword: string): Promise<{
    success: boolean;
    data: Array<{
      code: string;
      name: string;
      city: string;
      country: string;
      type: string;
    }>;
  }> {
    if (!keyword || keyword.trim().length < 1) {
      return { success: true, data: [] };
    }
    const results = await this.flightService.searchAirports(keyword.trim());
    return { success: true, data: results };
  }

  @Get("monthly-analysis")
  @ApiOperation({ summary: "Get daily price analysis for a month" })
  async getMonthlyAnalysis(
    @Query("origin") origin: string,
    @Query("destination") destination: string,
    @Query("month") month: string,
  ): Promise<{
    success: boolean;
    data: { date: string; price: number }[];
  }> {
    return this.flightService.getMonthlyAnalysis(origin, destination, month);
  }
}
