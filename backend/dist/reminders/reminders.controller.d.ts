import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
export declare class RemindersController {
    private readonly remindersService;
    constructor(remindersService: RemindersService);
    getUserReminders(userId: string): Promise<{
        success: boolean;
        data: any[];
        stats: {
            total: number;
            active: number;
            triggered: number;
        };
    }>;
    createReminder(createDto: CreateReminderDto): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    deleteReminder(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkReminderPrice(id: string): Promise<{
        success: boolean;
        data: {
            currentPrice: number;
            targetPrice: number;
            isTriggered: boolean;
            discount: number;
        };
    }>;
}
