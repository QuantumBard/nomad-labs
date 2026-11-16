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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async trackFlightSearch(data) {
        try {
            await this.prisma.flightSearch.create({
                data: {
                    userId: data.userId,
                    source: data.source,
                    destination: data.destination,
                    sourceCode: data.sourceCode,
                    destinationCode: data.destinationCode,
                    departureDate: data.departureDate,
                    returnDate: data.returnDate,
                    resultsCount: data.resultsCount,
                    averagePrice: data.averagePrice,
                    minPrice: data.minPrice,
                    maxPrice: data.maxPrice,
                },
            });
            if (data.responseTime) {
                await this.trackApiUsage('flight_search', data.responseTime, true);
            }
            this.logger.debug(`Tracked flight search: ${data.source} → ${data.destination}`);
        }
        catch (error) {
            this.logger.error('Failed to track flight search:', error.message);
        }
    }
    async trackPriceAlert(data) {
        try {
            await this.prisma.priceAlert.create({
                data: {
                    userId: data.userId,
                    source: data.source,
                    destination: data.destination,
                    targetPrice: data.targetPrice,
                    currentPrice: data.currentPrice,
                    discountPercent: data.discountPercent,
                    lastNotifiedAt: new Date(),
                },
            });
            this.logger.debug(`Tracked price alert for user ${data.userId}: ${data.discountPercent}% discount`);
        }
        catch (error) {
            this.logger.error('Failed to track price alert:', error.message);
        }
    }
    async trackApiUsage(endpoint, responseTime, success, errorMessage, provider = 'amadeus') {
        try {
            await this.prisma.apiUsage.create({
                data: {
                    endpoint,
                    provider,
                    responseTime,
                    success,
                    errorMessage,
                },
            });
            if (!success) {
                this.logger.warn(`API call failed for ${endpoint}: ${errorMessage}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to track API usage:', error.message);
        }
    }
    async getSearchAnalytics(days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const [totalSearches, routes] = await Promise.all([
            this.prisma.flightSearch.count({
                where: { createdAt: { gte: since } },
            }),
            this.prisma.flightSearch.groupBy({
                by: ['source', 'destination'],
                where: { createdAt: { gte: since } },
                _count: { id: true },
                _avg: { averagePrice: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10,
            }),
        ]);
        const topRoutes = routes.map((route) => ({
            route: `${route.source} → ${route.destination}`,
            count: route._count.id,
            averagePrice: Math.round(route._avg.averagePrice || 0),
        }));
        const apiUsage = await this.prisma.apiUsage.findMany({
            where: {
                endpoint: 'flight_search',
                createdAt: { gte: since },
            },
            select: { responseTime: true },
        });
        const averageResponseTime = apiUsage.length > 0
            ? Math.round(apiUsage.reduce((sum, u) => sum + (u.responseTime || 0), 0) / apiUsage.length)
            : 0;
        return {
            totalSearches,
            uniqueRoutes: routes.length,
            topRoutes,
            averageResponseTime,
        };
    }
    async getPriceAnalytics(days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const alerts = await this.prisma.priceAlert.findMany({
            where: {
                createdAt: { gte: since },
            },
            select: {
                targetPrice: true,
                currentPrice: true,
                discountPercent: true,
                createdAt: true,
            },
        });
        const totalAlertsTriggered = alerts.length;
        const averageDiscount = alerts.length > 0
            ? Math.round(alerts.reduce((sum, a) => sum + (a.discountPercent || 0), 0) / alerts.length)
            : 0;
        const priceDrops = alerts
            .filter((a) => a.targetPrice && a.currentPrice)
            .map((a) => ((a.targetPrice - a.currentPrice) / a.targetPrice) * 100);
        const averagePriceDrop = priceDrops.length > 0
            ? Math.round(priceDrops.reduce((sum, d) => sum + d, 0) / priceDrops.length)
            : 0;
        const priceTrends = await this.getPriceTrends(since);
        return {
            averagePriceDrop,
            totalAlertsTriggered,
            averageDiscount,
            priceTrends,
        };
    }
    async getPriceTrends(since) {
        const searches = await this.prisma.flightSearch.findMany({
            where: { createdAt: { gte: since } },
            select: {
                averagePrice: true,
                minPrice: true,
                maxPrice: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        const grouped = searches.reduce((acc, search) => {
            const date = search.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { prices: [], minPrices: [], maxPrices: [] };
            }
            if (search.averagePrice)
                acc[date].prices.push(search.averagePrice);
            if (search.minPrice)
                acc[date].minPrices.push(search.minPrice);
            if (search.maxPrice)
                acc[date].maxPrices.push(search.maxPrice);
            return acc;
        }, {});
        return Object.entries(grouped)
            .map(([date, data]) => ({
            date,
            averagePrice: Math.round(data.prices.reduce((a, b) => a + b, 0) / (data.prices.length || 1)),
            minPrice: Math.min(...data.minPrices) || 0,
            maxPrice: Math.max(...data.maxPrices) || 0,
        }))
            .slice(-30);
    }
    async getUsageMetrics(days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        const [totalCalls, errorCalls, avgLatency] = await Promise.all([
            this.prisma.apiUsage.count({
                where: { createdAt: { gte: since } },
            }),
            this.prisma.apiUsage.count({
                where: {
                    createdAt: { gte: since },
                    success: false,
                },
            }),
            this.prisma.apiUsage.aggregate({
                where: { createdAt: { gte: since } },
                _avg: { responseTime: true },
            }),
        ]);
        return {
            apiCalls: totalCalls,
            apiErrors: errorCalls,
            successRate: totalCalls > 0
                ? Math.round(((totalCalls - errorCalls) / totalCalls) * 100)
                : 100,
            averageLatency: Math.round(avgLatency._avg.responseTime || 0),
        };
    }
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const [totalUsers, activeReminders, searchesToday, alertsThisWeek] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.flightReminder.count({
                where: { status: 'ACTIVE' },
            }),
            this.prisma.flightSearch.count({
                where: { createdAt: { gte: today } },
            }),
            this.prisma.priceAlert.count({
                where: { createdAt: { gte: weekAgo } },
            }),
        ]);
        return {
            totalUsers,
            activeReminders,
            searchesToday,
            alertsThisWeek,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map