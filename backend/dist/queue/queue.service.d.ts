import { Queue, Job } from 'bullmq';
interface PriceCheckJob {
    reminderId: string;
    priority?: number;
}
interface NotificationJob {
    userId: string;
    type: 'price_alert' | 'expiry' | 'welcome';
    payload: Record<string, unknown>;
}
interface AnalyticsJob {
    event: string;
    data: Record<string, unknown>;
    timestamp: string;
}
export declare class QueueService {
    private readonly priceChecksQueue;
    private readonly notificationsQueue;
    private readonly analyticsQueue;
    private readonly logger;
    constructor(priceChecksQueue: Queue, notificationsQueue: Queue, analyticsQueue: Queue);
    addPriceCheckJob(data: PriceCheckJob, delay?: number): Promise<Job>;
    addNotificationJob(data: NotificationJob, delay?: number): Promise<Job>;
    addAnalyticsJob(data: AnalyticsJob): Promise<Job>;
    getQueueStatus(queueName: 'price-checks' | 'notifications' | 'analytics'): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
        delayed: number;
    }>;
    cleanCompletedJobs(queueName: 'price-checks' | 'notifications' | 'analytics', hours?: number): Promise<number>;
    pauseQueue(queueName: 'price-checks' | 'notifications' | 'analytics'): Promise<void>;
    resumeQueue(queueName: 'price-checks' | 'notifications' | 'analytics'): Promise<void>;
}
export {};
