import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RedisConfig } from '@libs/config';
import { Redis } from 'ioredis';
import { RedisPubSubService } from './redis-pubsub.service';
import { REDIS_CLIENT } from './redis.constants';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [RedisConfig],
    }),
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigType<typeof RedisConfig>) => {
        return new Redis({
          host: config.host,
          port: config.port,
        });
      },
      inject: [RedisConfig.KEY],
    },
    RedisPubSubService,
  ],
  exports: [REDIS_CLIENT, RedisPubSubService],
})
export class RedisModule {}
