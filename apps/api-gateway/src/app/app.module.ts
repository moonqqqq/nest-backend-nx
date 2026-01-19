import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppConfig, ServiceConfig } from '@libs/config';
import { LoggerModule } from '@libs/logger';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { LlmSessionController } from './llm-session/llm-session.controller';
import { JWTModule } from '@libs/shared';
import { RedisModule } from '@libs/redis';
import { LlmMessageController } from './llm-session/llm-message.controller';
import { LlmStreamModule } from './llm-stream/llm-stream.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig],
    }),
    LoggerModule,
    JWTModule,
    RedisModule,
    LlmStreamModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (config: ConfigType<typeof ServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            port: parseInt(config.auth.tcpPort),
          },
        }),
        inject: [ServiceConfig.KEY],
      },
      {
        name: 'USER_SERVICE',
        useFactory: (config: ConfigType<typeof ServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            port: parseInt(config.user.tcpPort),
          },
        }),
        inject: [ServiceConfig.KEY],
      },
      {
        name: 'RESEARCH_LLM_SERVICE',
        useFactory: (config: ConfigType<typeof ServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            port: parseInt(config.researchLlm.tcpPort),
          },
        }),
        inject: [ServiceConfig.KEY],
      },
    ]),
  ],
  controllers: [AuthController, LlmSessionController, LlmMessageController],
  providers: [],
})
export class AppModule {}
