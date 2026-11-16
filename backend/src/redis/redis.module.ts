import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('UPSTASH_REDIS_REST_URL');
        const token = configService.get<string>('UPSTASH_REDIS_REST_TOKEN');

        if (!url || !token) {
          console.warn('⚠️  Upstash Redis credentials not configured. Caching disabled.');
          return null;
        }

        const redis = new Redis({
          url,
          token,
        });

        console.log('✅ Upstash Redis configured successfully');
        console.log(`   URL: ${url.replace(/token=[^&]+/, 'token=***')}`);

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
