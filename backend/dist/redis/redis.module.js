"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = exports.REDIS_CLIENT = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_1 = require("@upstash/redis");
exports.REDIS_CLIENT = 'REDIS_CLIENT';
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.REDIS_CLIENT,
                useFactory: (configService) => {
                    const url = configService.get('UPSTASH_REDIS_REST_URL');
                    const token = configService.get('UPSTASH_REDIS_REST_TOKEN');
                    if (!url || !token) {
                        console.warn('⚠️  Upstash Redis credentials not configured. Caching disabled.');
                        return null;
                    }
                    const redis = new redis_1.Redis({
                        url,
                        token,
                    });
                    console.log('✅ Upstash Redis configured successfully');
                    console.log(`   URL: ${url.replace(/token=[^&]+/, 'token=***')}`);
                    return redis;
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [exports.REDIS_CLIENT],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map