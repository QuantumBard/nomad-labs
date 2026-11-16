import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FlightService } from "../flight/flight.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateReminderDto } from "./dto/create-reminder.dto";
import { ReminderStatus } from "@prisma/client";

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly flightService: FlightService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getUserReminders(userId: string): Promise<{
    success: boolean;
    data: any[];
    stats: {
      total: number;
      active: number;
      triggered: number;
    };
  }> {
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
      active: reminders.filter((r) => r.status === ReminderStatus.ACTIVE)
        .length,
      triggered: reminders.filter((r) => r.status === ReminderStatus.TRIGGERED)
        .length,
    };

    return {
      success: true,
      data: reminders,
      stats,
    };
  }

  async createReminder(dto: CreateReminderDto): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    // If no target price provided, calculate based on discountThreshold (default: 20% below average)
    let targetPrice = dto.targetPrice;

    if (!targetPrice) {
      const analysis = await this.flightService.getPriceAnalysis(
        dto.sourceCode || dto.source,
        dto.destinationCode || dto.destination,
        dto.startDate,
      );
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
        status: ReminderStatus.ACTIVE,
      },
    });

    // Immediately check current price
    await this.checkReminderPrice(reminder.id);

    this.logger.log(`Created reminder ${reminder.id} for user ${dto.userId}`);

    return {
      success: true,
      data: reminder,
      message: `Reminder created! Target price: $${targetPrice}`,
    };
  }

  async deleteReminder(
    id: string,
    userId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    await this.prisma.flightReminder.deleteMany({
      where: { id, userId },
    });

    return {
      success: true,
      message: "Reminder deleted successfully",
    };
  }

  async checkReminderPrice(reminderId: string): Promise<{
    success: boolean;
    data: {
      currentPrice: number;
      targetPrice: number;
      isTriggered: boolean;
      discount: number;
    };
  }> {
    const reminder = await this.prisma.flightReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    // Search for current flights
    const searchResult = await this.flightService.searchFlights({
      origin: reminder.sourceCode || reminder.source,
      destination: reminder.destinationCode || reminder.destination,
      departureDate: reminder.startDate.toISOString().split("T")[0],
      returnDate: reminder.endDate?.toISOString().split("T")[0],
    });

    const currentPrice = searchResult.meta.minPrice;
    const isTriggered = currentPrice <= reminder.targetPrice;
    const discount = Math.round(
      ((reminder.targetPrice - currentPrice) / reminder.targetPrice) * 100,
    );

    // Update reminder
    await this.prisma.flightReminder.update({
      where: { id: reminderId },
      data: {
        currentPrice,
        isTriggered,
        ...(isTriggered && {
          status: ReminderStatus.TRIGGERED,
          triggeredAt: new Date(),
        }),
      },
    });

    // Log fare history
    await this.prisma.fareHistory.create({
      data: {
        reminderId,
        price: currentPrice,
        currency: "USD",
      },
    });

    // Send notification if triggered
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

  async checkAllActiveReminders(): Promise<{
    checked: number;
    triggered: number;
  }> {
    const activeReminders = await this.prisma.flightReminder.findMany({
      where: { status: ReminderStatus.ACTIVE },
    });

    let triggered = 0;

    for (const reminder of activeReminders) {
      try {
        const result = await this.checkReminderPrice(reminder.id);
        if (result.data.isTriggered) {
          triggered++;
        }
      } catch (error) {
        this.logger.error(
          `Failed to check reminder ${reminder.id}:`,
          error.message,
        );
      }
    }

    this.logger.log(
      `Checked ${activeReminders.length} reminders, ${triggered} triggered`,
    );

    return {
      checked: activeReminders.length,
      triggered,
    };
  }
}
