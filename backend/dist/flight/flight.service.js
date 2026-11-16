"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FlightService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const amadeus_service_1 = require("../amadeus/amadeus.service");
const redis_module_1 = require("../redis/redis.module");
const redis_1 = require("@upstash/redis");
let FlightService = FlightService_1 = class FlightService {
    constructor(prisma, amadeusService, redis) {
        this.prisma = prisma;
        this.amadeusService = amadeusService;
        this.redis = redis;
        this.logger = new common_1.Logger(FlightService_1.name);
    }
    async searchFlights(searchDto) {
        const cacheKey = this.generateCacheKey(searchDto);
        if (this.redis) {
            try {
                const cached = await this.redis.get(cacheKey);
                if (cached) {
                    this.logger.log("Returning cached flight results");
                    const parsed = JSON.parse(cached);
                    return {
                        success: true,
                        data: parsed.flights,
                        meta: parsed.meta,
                    };
                }
            }
            catch (error) {
                this.logger.warn("Redis cache error:", error.message);
            }
        }
        const searchParams = {
            originLocationCode: searchDto.origin,
            destinationLocationCode: searchDto.destination,
            departureDate: searchDto.departureDate,
            returnDate: searchDto.returnDate,
            adults: searchDto.adults || 1,
            currencyCode: searchDto.currency || "USD",
        };
        const flights = await this.amadeusService.searchFlights(searchParams);
        const prices = flights.map((f) => f.price);
        const averagePrice = prices.length > 0
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
        if (this.redis) {
            try {
                await this.redis.setex(cacheKey, 300, JSON.stringify({ flights, meta }));
                this.logger.log("Flight results cached for 5 minutes");
            }
            catch (error) {
                this.logger.warn("Failed to cache flight results:", error.message);
            }
        }
        await this.logSearch(searchDto, meta);
        return {
            success: true,
            data: flights,
            meta,
        };
    }
    async getPriceAnalysis(origin, destination, date) {
        const analysis = await this.amadeusService.getPriceAnalysis(origin, destination, date);
        const recommendedTarget = Math.round(analysis.averagePrice * 0.8);
        const skyDate = date.replace(/-/g, "").substring(2);
        const [yyyy, mm, dd] = date.split("-");
        const usDate = `${mm}/${dd}/${yyyy}`;
        const buildLinks = (org, dst) => ({
            googleFlights: `https://www.google.com/travel/flights?q=Flights%20to%20${dst}%20from%20${org}%20on%20${date}`,
            skyscanner: `https://www.skyscanner.net/transport/flights/${org.toLowerCase()}/${dst.toLowerCase()}/${skyDate}/`,
            kayak: `https://www.kayak.com/flights/${org}-${dst}/${date}?sort=price_a`,
            expedia: `https://www.expedia.com/Flights-Search?flight-type=on&mode=search&trip=oneway&leg1=from:${org},to:${dst},departure:${usDate}TANYT&passengers=adults:1`,
            cheapoair: `https://www.cheapoair.com/air/search?from=${org}&to=${dst}&depDate=${usDate}&adults=1&tripType=ONEWAY`,
        });
        const bookingLinks = buildLinks(origin, destination);
        let offers = [];
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
        }
        catch {
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
    async getPopularRoutes() {
        const popularRoutes = await this.prisma.$queryRaw `
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
            data: popularRoutes,
        };
    }
    generateCacheKey(dto) {
        return `flights:${dto.origin}:${dto.destination}:${dto.departureDate}:${dto.returnDate || "one-way"}:${dto.adults || 1}`;
    }
    async logSearch(dto, meta) {
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
        }
        catch (error) {
            this.logger.error("Failed to log search:", error.message);
        }
    }
    async searchAirports(keyword) {
        return this.amadeusService.searchAirports(keyword);
    }
    async getMonthlyAnalysis(origin, destination, yearMonth) {
        const data = await this.amadeusService.getMonthlyAnalysis(origin, destination, yearMonth);
        return {
            success: true,
            data,
        };
    }
};
exports.FlightService = FlightService;
exports.FlightService = FlightService = FlightService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Optional)()),
    __param(2, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        amadeus_service_1.AmadeusService,
        redis_1.Redis])
], FlightService);
//# sourceMappingURL=flight.service.js.map