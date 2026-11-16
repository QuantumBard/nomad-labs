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
var RemindersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const flight_service_1 = require("../flight/flight.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let RemindersService = RemindersService_1 = class RemindersService {
    constructor(prisma, flightService, notificationsService) {
        this.prisma = prisma;
        this.flightService = flightService;
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(RemindersService_1.name);
    }
    async getUserReminders(userId) {
        const reminders = await this.prisma.flightReminder.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                fareHistory: {
                    orderBy: { recordedAt: "desc" },
                    take: 5,
                },
            },
        });
        const stats = {
            total: reminders.length,
            active: reminders.filter((r) => r.status === client_1.ReminderStatus.ACTIVE)
                .length,
            triggered: reminders.filter((r) => r.status === client_1.ReminderStatus.TRIGGERED)
                .length,
        };
        return {
            success: true,
            data: reminders,
            stats,
        };
    }
    async createReminder(dto) {
        let targetPrice = dto.targetPrice;
        if (!targetPrice) {
            const analysis = await this.flightService.getPriceAnalysis(dto.sourceCode || dto.source, dto.destinationCode || dto.destination, dto.startDate);
            const discountRatio = 1 - (dto.discountThreshold ?? 20) / 100;
            targetPrice = Math.round(analysis.data.averagePrice * discountRatio);
        }
        const reminder = await this.prisma.flightReminder.create({
            data: {
                userId: dto.userId,
                source: dto.source,
                destination: dto.destination,
                sourceCode: dto.sourceCode,
                destinationCode: dto.destinationCode,
                startDate: new Date(dto.startDate),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                targetPrice,
                status: client_1.ReminderStatus.ACTIVE,
            },
        });
        await this.checkReminderPrice(reminder.id);
        this.logger.log(`Created reminder ${reminder.id} for user ${dto.userId}`);
        return {
            success: true,
            data: reminder,
            message: `Reminder created! Target price: $${targetPrice}`,
        };
    }
    async deleteReminder(id, userId) {
        await this.prisma.flightReminder.deleteMany({
            where: { id, userId },
        });
        return {
            success: true,
            message: "Reminder deleted successfully",
        };
    }
    async checkReminderPrice(reminderId) {
        const reminder = await this.prisma.flightReminder.findUnique({
            where: { id: reminderId },
        });
        if (!reminder) {
            throw new Error("Reminder not found");
        }
        const searchResult = await this.flightService.searchFlights({
            origin: reminder.sourceCode || reminder.source,
            destination: reminder.destinationCode || reminder.destination,
            departureDate: reminder.startDate.toISOString().split("T")[0],
            returnDate: reminder.endDate?.toISOString().split("T")[0],
        });
        const currentPrice = searchResult.meta.minPrice;
        const isTriggered = currentPrice <= reminder.targetPrice;
        const discount = Math.round(((reminder.targetPrice - currentPrice) / reminder.targetPrice) * 100);
        await this.prisma.flightReminder.update({
            where: { id: reminderId },
            data: {
                currentPrice,
                isTriggered,
                ...(isTriggered && {
                    status: client_1.ReminderStatus.TRIGGERED,
                    triggeredAt: new Date(),
                }),
            },
        });
        await this.prisma.fareHistory.create({
            data: {
                reminderId,
                price: currentPrice,
                currency: "USD",
            },
        });
        if (isTriggered && !reminder.isTriggered) {
            await this.notificationsService.sendPriceAlert(reminder.userId, {
                source: reminder.source,
                destination: reminder.destination,
                currentPrice,
                targetPrice: reminder.targetPrice,
                discount,
            });
        }
        return {
            success: true,
            data: {
                currentPrice,
                targetPrice: reminder.targetPrice,
                isTriggered,
                discount,
            },
        };
    }
    async checkAllActiveReminders() {
        const activeReminders = await this.prisma.flightReminder.findMany({
            where: { status: client_1.ReminderStatus.ACTIVE },
        });
        let triggered = 0;
        for (const reminder of activeReminders) {
            try {
                const result = await this.checkReminderPrice(reminder.id);
                if (result.data.isTriggered) {
                    triggered++;
                }
            }
            catch (error) {
                this.logger.error(`Failed to check reminder ${reminder.id}:`, error.message);
            }
        }
        this.logger.log(`Checked ${activeReminders.length} reminders, ${triggered} triggered`);
        return {
            checked: activeReminders.length,
            triggered,
        };
    }
};
exports.RemindersService = RemindersService;
exports.RemindersService = RemindersService = RemindersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        flight_service_1.FlightService,
        notifications_service_1.NotificationsService])
], RemindersService);
//# sourceMappingURL=reminders.service.js.map