import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
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

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('price-checks') private readonly priceChecksQueue: Queue,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    @InjectQueue('analytics') private readonly analyticsQueue: Queue,
  ) {}

  async addPriceCheckJob(data: PriceCheckJob, delay?: number): Promise<Job> {
    try {
      const job = await this.priceChecksQueue.add('price-check', data, {
        priority: data.priority || 5,
        delay,
      });
      
      this.logger.log(`Added price check job ${job.id} for reminder ${data.reminderId}`);
      return job;
    } catch (error) {
      this.logger.error('Failed to add price check job:', error.message);
      throw error;
    }
  }

  async addNotificationJob(data: NotificationJob, delay?: number): Promise<Job> {
    try {
      const job = await this.notificationsQueue.add('send-notification', data, {
        priority: data.type === 'price_alert' ? 1 : 10,
        delay,
      });
      
      this.logger.log(`Added notification job ${job.id} for user ${data.userId}`);
      return job;
    } catch (error) {
      this.logger.error('Failed to add notification job:', error.message);
      throw error;
    }
  }

  async addAnalyticsJob(data: AnalyticsJob): Promise<Job> {
    try {
      const job = await this.analyticsQueue.add('track-event', data, {
        priority: 20,
      });
      
      this.logger.debug(`Added analytics job ${job.id} for event ${data.event}`);
      return job;
    } catch (error) {
      this.logger.error('Failed to add analytics job:', error.message);
      throw error;
    }
  }

  async getQueueStatus(queueName: 'price-checks' | 'notifications' | 'analytics'): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    let queue: Queue;
    
    switch (queueName) {
      case 'price-checks':
        queue = this.priceChecksQueue;
        break;
      case 'notifications':
        queue = this.notificationsQueue;
        break;
      case 'analytics':
        queue = this.analyticsQueue;
        break;
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    };
  }

  async cleanCompletedJobs(queueName: 'price-checks' | 'notifications' | 'analytics', hours: number = 24): Promise<number> {
    let queue: Queue;
    
    switch (queueName) {
      case 'price-checks':
        queue = this.priceChecksQueue;
        break;
      case 'notifications':
        queue = this.notificationsQueue;
        break;
      case 'analytics':
        queue = this.analyticsQueue;
        break;
    }

    const cleaned = await queue.clean(hours * 60 * 60 * 1000, 100, 'completed');
    this.logger.log(`Cleaned ${cleaned.length} completed jobs from ${queueName}`);
    return cleaned.length;
  }

  async pauseQueue(queueName: 'price-checks' | 'notifications' | 'analytics'): Promise<void> {
    let queue: Queue;
    
    switch (queueName) {
      case 'price-checks':
        queue = this.priceChecksQueue;
        break;
      case 'notifications':
        queue = this.notificationsQueue;
        break;
      case 'analytics':
        queue = this.analyticsQueue;
        break;
    }

    await queue.pause();
    this.logger.log(`Paused queue: ${queueName}`);
  }

  async resumeQueue(queueName: 'price-checks' | 'notifications' | 'analytics'): Promise<void> {
    let queue: Queue;
    
    switch (queueName) {
      case 'price-checks':
        queue = this.priceChecksQueue;
        break;
      case 'notifications':
        queue = this.notificationsQueue;
        break;
      case 'analytics':
        queue = this.analyticsQueue;
        break;
    }

    await queue.resume();
    this.logger.log(`Resumed queue: ${queueName}`);
  }
}
