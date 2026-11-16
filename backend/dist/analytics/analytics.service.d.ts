import { PrismaService } from '../prisma/prisma.service';
interface SearchAnalytics {
    totalSearches: number;
    uniqueRoutes: number;
    topRoutes: Array<{
        route: string;
        count: number;
        averagePrice: number;
    }>;
    averageResponseTime: number;
}
interface PriceAnalytics {
    averagePriceDrop: number;
    totalAlertsTriggered: number;
    averageDiscount: number;
    priceTrends: Array<{
        date: string;
        averagePrice: number;
        minPrice: number;
        maxPrice: number;
    }>;
}
interface UsageMetrics {
    apiCalls: number;
    apiErrors: number;
    successRate: number;
    averageLatency: number;
}
export declare class AnalyticsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    trackFlightSearch(data: {
        userId?: string;
        source: string;
        destination: string;
        sourceCode?: string;
        destinationCode?: string;
        departureDate: Date;
        returnDate?: Date;
        resultsCount: number;
        averagePrice?: number;
        minPrice?: number;
        maxPrice?: number;
        responseTime?: number;
    }): Promise<void>;
    trackPriceAlert(data: {
        userId: string;
        source: string;
        destination: string;
        targetPrice: number;
        currentPrice: number;
        discountPercent: number;
    }): Promise<void>;
    trackApiUsage(endpoint: string, responseTime: number, success: boolean, errorMessage?: string, provider?: string): Promise<void>;
    getSearchAnalytics(days?: number): Promise<SearchAnalytics>;
    getPriceAnalytics(days?: number): Promise<PriceAnalytics>;
    private getPriceTrends;
    getUsageMetrics(days?: number): Promise<UsageMetrics>;
    getDashboardStats(): Promise<{
        totalUsers: number;
        activeReminders: number;
        searchesToday: number;
        alertsThisWeek: number;
    }>;
}
export {};
