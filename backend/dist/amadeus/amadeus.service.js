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
var AmadeusService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmadeusService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Amadeus = require("amadeus");
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
let AmadeusService = AmadeusService_1 = class AmadeusService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AmadeusService_1.name);
        const apiKey = this.configService.get("AMADEUS_API_KEY");
        const apiSecret = this.configService.get("AMADEUS_API_SECRET");
        if (!apiKey || !apiSecret) {
            this.logger.warn("Amadeus API credentials not configured. Using mock data.");
        }
        else {
            this.amadeus = new Amadeus({
                clientId: apiKey,
                clientSecret: apiSecret,
            });
        }
    }
    async searchFlights(params) {
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
            const response = await this.amadeus.shopping.flightOffersSearch.get(searchParams);
            const duration = Date.now() - startTime;
            this.logger.log(`Amadeus API call completed in ${duration}ms`);
            return this.transformFlightOffers(response.data);
        }
        catch (error) {
            this.logger.error("Error searching flights:", error.message);
            return this.getMockFlightData(params);
        }
    }
    transformFlightOffers(data) {
        if (!Array.isArray(data))
            return [];
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
    getMockFlightData(params) {
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
    async getPriceAnalysis(originCode, destinationCode, departureDate) {
        if (this.amadeus) {
            try {
                const res = await this.amadeus.analytics.itineraryPriceMetrics.get({
                    originIataCode: originCode,
                    destinationIataCode: destinationCode,
                    departureDate,
                    currencyCode: "USD",
                    oneWay: true,
                });
                const metrics = res.data?.[0]?.priceMetrics || [];
                if (metrics.length >= 3) {
                    const get = (rank) => {
                        const m = metrics.find((m) => m.quartileRanking === rank);
                        return m ? Math.round(parseFloat(m.amount)) : 0;
                    };
                    const min = get("MINIMUM");
                    const median = get("MEDIAN");
                    const max = get("MAXIMUM");
                    const q1 = get("FIRST_QUARTILE");
                    const q3 = get("THIRD_QUARTILE");
                    if (median > 0) {
                        this.logger.log(`[Tier 1] itineraryPriceMetrics: median=$${median} min=$${min} max=$${max}`);
                        const midpoint = (min + max) / 2;
                        const trend = median > midpoint ? "up" : "down";
                        return {
                            averagePrice: median,
                            minPrice: q1 || min,
                            maxPrice: q3 || max,
                            trend,
                        };
                    }
                }
                this.logger.log("[Tier 1] No itineraryPriceMetrics data for this route — falling to Tier 2");
            }
            catch (err) {
                this.logger.warn(`[Tier 1] itineraryPriceMetrics failed: ${err?.message || err} — falling to Tier 2`);
            }
        }
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
                const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
                const min = Math.round(Math.min(...prices));
                const max = Math.round(Math.max(...prices));
                const midpoint = (min + max) / 2;
                const trend = average > midpoint ? "up" : "down";
                this.logger.log(`[Tier 2] Live search average: avg=$${average} min=$${min} max=$${max} (${flights.length} fares)`);
                return { averagePrice: average, minPrice: min, maxPrice: max, trend };
            }
            this.logger.warn("[Tier 2] No flight results — falling to Tier 3 heuristic");
        }
        catch (err) {
            this.logger.warn(`[Tier 2] Live search failed: ${err?.message || err} — falling to Tier 3`);
        }
        this.logger.log("[Tier 3] Using route-distance heuristic for price estimate");
        return this.getHeuristicPrice(originCode, destinationCode);
    }
    getHeuristicPrice(originCode, destinationCode) {
        const combined = `${originCode}:${destinationCode}`.toUpperCase();
        const domesticPairs = /^(CCU|DEL|BOM|MAA|HYD|BLR|BLR|SIN|KUL|BKK|HKG)/;
        const isDomestic = originCode.slice(0, 1) === destinationCode.slice(0, 1) ||
            domesticPairs.test(combined);
        const base = isDomestic ? 120 : 480;
        return {
            averagePrice: base,
            minPrice: Math.round(base * 0.7),
            maxPrice: Math.round(base * 1.4),
            trend: "up",
        };
    }
    async searchAirports(keyword) {
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
            return (response.data || []).map((loc) => ({
                code: loc.iataCode,
                name: loc.name,
                city: loc.address?.cityName || loc.name,
                country: loc.address?.countryName || "",
                type: loc.subType,
            }));
        }
        catch (error) {
            this.logger.warn("Amadeus airport search failed, using static fallback:", error.message);
            return this.getStaticAirports(keyword);
        }
    }
    getStaticAirports(keyword) {
        const q = keyword.toLowerCase();
        return STATIC_AIRPORTS.filter((a) => a.city.toLowerCase().includes(q) ||
            a.code.toLowerCase().includes(q) ||
            a.country.toLowerCase().includes(q))
            .slice(0, 10)
            .map((a) => ({
            ...a,
            name: `${a.city} Airport`,
            type: "AIRPORT",
        }));
    }
    async getMonthlyAnalysis(origin, destination, yearMonth) {
        if (this.amadeus) {
            try {
                const response = await this.amadeus.shopping.flightDates.get({
                    origin,
                    destination,
                    oneWay: true,
                });
                if (response.data && response.data.length > 0) {
                    return response.data
                        .filter((d) => d.departureDate.startsWith(yearMonth))
                        .map((d) => ({
                        date: d.departureDate,
                        price: Math.round(parseFloat(d.price.total)),
                    }))
                        .sort((a, b) => a.date.localeCompare(b.date));
                }
            }
            catch (err) {
                this.logger.warn("Cheapest date search failed, using mock monthly data:", err.message);
            }
        }
        const [year, month] = yearMonth.split("-").map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        const basePrice = this.getHeuristicPrice(origin, destination).averagePrice;
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${yearMonth}-${day.toString().padStart(2, "0")}`;
            const d = new Date(year, month - 1, day);
            const isWeekend = d.getDay() === 0 || d.getDay() === 5 || d.getDay() === 6;
            const weekendSurge = isWeekend ? 1.25 : 1.0;
            const randomFluc = 0.95 + Math.random() * 0.1;
            const monthMidPoint = daysInMonth / 2;
            const proximityToMid = Math.abs(day - monthMidPoint) / monthMidPoint;
            const midMonthDiscount = 0.9 + proximityToMid * 0.1;
            return {
                date: dateStr,
                price: Math.round(basePrice * weekendSurge * randomFluc * midMonthDiscount),
            };
        });
    }
};
exports.AmadeusService = AmadeusService;
exports.AmadeusService = AmadeusService = AmadeusService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AmadeusService);
//# sourceMappingURL=amadeus.service.js.map