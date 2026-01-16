import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RedisConfig } from '@libs/config';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

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
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
