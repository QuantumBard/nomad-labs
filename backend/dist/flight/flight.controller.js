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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const flight_service_1 = require("./flight.service");
const search_flights_dto_1 = require("./dto/search-flights.dto");
let FlightController = class FlightController {
    constructor(flightService) {
        this.flightService = flightService;
    }
    async searchFlights(searchDto) {
        return this.flightService.searchFlights(searchDto);
    }
    async getPriceAnalysis(origin, destination, date) {
        return this.flightService.getPriceAnalysis(origin, destination, date);
    }
    async getPopularRoutes() {
        return this.flightService.getPopularRoutes();
    }
    async searchAirports(keyword) {
        if (!keyword || keyword.trim().length < 1) {
            return { success: true, data: [] };
        }
        const results = await this.flightService.searchAirports(keyword.trim());
        return { success: true, data: results };
    }
    async getMonthlyAnalysis(origin, destination, month) {
        return this.flightService.getMonthlyAnalysis(origin, destination, month);
    }
};
exports.FlightController = FlightController;
__decorate([
    (0, common_1.Get)("search"),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: "Search for flights" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_flights_dto_1.SearchFlightsDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "searchFlights", null);
__decorate([
    (0, common_1.Get)("price-analysis"),
    (0, swagger_1.ApiOperation)({ summary: "Get price analysis for a route" }),
    __param(0, (0, common_1.Query)("origin")),
    __param(1, (0, common_1.Query)("destination")),
    __param(2, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "getPriceAnalysis", null);
__decorate([
    (0, common_1.Get)("popular-routes"),
    (0, swagger_1.ApiOperation)({ summary: "Get popular flight routes" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "getPopularRoutes", null);
__decorate([
    (0, common_1.Get)("airports"),
    (0, swagger_1.ApiOperation)({
        summary: "Search airports and cities by keyword (uses Amadeus API)",
    }),
    __param(0, (0, common_1.Query)("keyword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "searchAirports", null);
__decorate([
    (0, common_1.Get)("monthly-analysis"),
    (0, swagger_1.ApiOperation)({ summary: "Get daily price analysis for a month" }),
    __param(0, (0, common_1.Query)("origin")),
    __param(1, (0, common_1.Query)("destination")),
    __param(2, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "getMonthlyAnalysis", null);
exports.FlightController = FlightController = __decorate([
    (0, swagger_1.ApiTags)("Flights"),
    (0, common_1.Controller)("flights"),
    __metadata("design:paramtypes", [flight_service_1.FlightService])
], FlightController);
//# sourceMappingURL=flight.controller.js.map