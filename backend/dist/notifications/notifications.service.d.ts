import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
interface PriceAlertPayload {
    source: string;
    destination: string;
    currentPrice: number;
    targetPrice: number;
    discount: number;
}
interface NotificationResult {
    success: boolean;
    message: string;
    provider?: string;
}
export declare class NotificationsService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private transporter;
    private readonly emailFrom;
    private readonly smtpUser;
    private readonly isDev;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    sendPriceAlert(userId: string, payload: PriceAlertPayload): Promise<NotificationResult>;
    private sendEmailNotification;
    private sendMockNotification;
    sendBulkPriceAlerts(alerts: Array<{
        userId: string;
        payload: PriceAlertPayload;
    }>): Promise<{
        success: number;
        failed: number;
        results: NotificationResult[];
    }>;
    sendReminderExpiryNotification(userId: string, reminderId: string): Promise<NotificationResult>;
}
export {};
