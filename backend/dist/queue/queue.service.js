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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let QueueService = QueueService_1 = class QueueService {
    constructor(priceChecksQueue, notificationsQueue, analyticsQueue) {
        this.priceChecksQueue = priceChecksQueue;
        this.notificationsQueue = notificationsQueue;
        this.analyticsQueue = analyticsQueue;
        this.logger = new common_1.Logger(QueueService_1.name);
    }
    async addPriceCheckJob(data, delay) {
        try {
            const job = await this.priceChecksQueue.add('price-check', data, {
                priority: data.priority || 5,
                delay,
            });
            this.logger.log(`Added price check job ${job.id} for reminder ${data.reminderId}`);
            return job;
        }
        catch (error) {
            this.logger.error('Failed to add price check job:', error.message);
            throw error;
        }
    }
    async addNotificationJob(data, delay) {
        try {
            const job = await this.notificationsQueue.add('send-notification', data, {
                priority: data.type === 'price_alert' ? 1 : 10,
                delay,
            });
            this.logger.log(`Added notification job ${job.id} for user ${data.userId}`);
            return job;
        }
        catch (error) {
            this.logger.error('Failed to add notification job:', error.message);
            throw error;
        }
    }
    async addAnalyticsJob(data) {
        try {
            const job = await this.analyticsQueue.add('track-event', data, {
                priority: 20,
            });
            this.logger.debug(`Added analytics job ${job.id} for event ${data.event}`);
            return job;
        }
        catch (error) {
            this.logger.error('Failed to add analytics job:', error.message);
            throw error;
        }
    }
    async getQueueStatus(queueName) {
        let queue;
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
    async cleanCompletedJobs(queueName, hours = 24) {
        let queue;
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
    async pauseQueue(queueName) {
        let queue;
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
    async resumeQueue(queueName) {
        let queue;
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
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('price-checks')),
    __param(1, (0, bullmq_1.InjectQueue)('notifications')),
    __param(2, (0, bullmq_1.InjectQueue)('analytics')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        bullmq_2.Queue,
        bullmq_2.Queue])
], QueueService);
//# sourceMappingURL=queue.service.js.map