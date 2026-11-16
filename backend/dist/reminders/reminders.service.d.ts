import { PrismaService } from "../prisma/prisma.service";
import { FlightService } from "../flight/flight.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateReminderDto } from "./dto/create-reminder.dto";
export declare class RemindersService {
    private readonly prisma;
    private readonly flightService;
    private readonly notificationsService;
    private readonly logger;
    constructor(prisma: PrismaService, flightService: FlightService, notificationsService: NotificationsService);
    getUserReminders(userId: string): Promise<{
        success: boolean;
        data: any[];
        stats: {
            total: number;
            active: number;
            triggered: number;
        };
    }>;
    createReminder(dto: CreateReminderDto): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    deleteReminder(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkReminderPrice(reminderId: string): Promise<{
        success: boolean;
        data: {
            currentPrice: number;
            targetPrice: number;
            isTriggered: boolean;
            discount: number;
        };
    }>;
    checkAllActiveReminders(): Promise<{
        checked: number;
        triggered: number;
    }>;
}
