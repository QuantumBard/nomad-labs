import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';

const logger = new Logger('QueueModule');

@Global()
@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Check if we have Upstash Redis configured
        const upstashUrl = configService.get('UPSTASH_REDIS_REST_URL');
        const upstashToken = configService.get('UPSTASH_REDIS_REST_TOKEN');
        
        // Check if we have legacy Redis configured
        const redisHost = configService.get('REDIS_HOST');
        const redisPort = configService.get('REDIS_PORT');
        
        if (upstashUrl && upstashToken) {
          logger.log('Configuring BullMQ with Upstash Redis');
          // Upstash supports Redis protocol on port 6379
          // Extract hostname from REST URL
          const url = new URL(upstashUrl);
          return {
            connection: {
              host: url.hostname,
              port: 6379,
              password: upstashToken,
              tls: {}, // Upstash requires TLS
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
        } else if (redisHost) {
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
        } else {
          logger.warn('No Redis configuration found. Queue functionality will be disabled.');
          // Return a dummy config - the module will fail gracefully
          throw new Error('Redis is required for BullMQ. Please configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN or REDIS_HOST');
        }
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'price-checks' },
      { name: 'notifications' },
      { name: 'analytics' },
    ),
  ],
  providers: [QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
