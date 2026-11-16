"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const queue_service_1 = require("./queue.service");
const logger = new common_1.Logger('QueueModule');
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const upstashUrl = configService.get('UPSTASH_REDIS_REST_URL');
                    const upstashToken = configService.get('UPSTASH_REDIS_REST_TOKEN');
                    const redisHost = configService.get('REDIS_HOST');
                    const redisPort = configService.get('REDIS_PORT');
                    if (upstashUrl && upstashToken) {
                        logger.log('Configuring BullMQ with Upstash Redis');
                        const url = new URL(upstashUrl);
                        return {
                            connection: {
                                host: url.hostname,
                                port: 6379,
                                password: upstashToken,
                                tls: {},
                            },
                            defaultJobOptions: {
                                attempts: 3,
                                backoff: {
                                    type: 'exponential',
                                    delay: 1000,
                                },
                                removeOnComplete: 100,
                                removeOnFail: 50,
                            },
                        };
                    }
                    else if (redisHost) {
                        logger.log('Configuring BullMQ with legacy Redis');
                        return {
                            connection: {
                                host: redisHost,
                                port: configService.get('REDIS_PORT', 6379),
                                password: configService.get('REDIS_PASSWORD'),
                                db: configService.get('REDIS_DB', 0),
                            },
                            defaultJobOptions: {
                                attempts: 3,
                                backoff: {
                                    type: 'exponential',
                                    delay: 1000,
                                },
                                removeOnComplete: 100,
                                removeOnFail: 50,
                            },
                        };
                    }
                    else {
                        logger.warn('No Redis configuration found. Queue functionality will be disabled.');
                        throw new Error('Redis is required for BullMQ. Please configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN or REDIS_HOST');
                    }
                },
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({ name: 'price-checks' }, { name: 'notifications' }, { name: 'analytics' }),
        ],
        providers: [queue_service_1.QueueService],
        exports: [queue_service_1.QueueService, bullmq_1.BullModule],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map