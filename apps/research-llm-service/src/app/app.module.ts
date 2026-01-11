import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmSessionModule } from './modules/llm-session/llm-session.module';
import { LoggerModule } from '@libs/logger';
import { AppConfig, ServiceConfig } from '@libs/config';
import { DatabaseModule } from '@libs/database';
import { ConfigModule } from '@nestjs/config';
import { LlmMessageModule } from './modules/llm-message/llm-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig],
    }),
    DatabaseModule,
    LlmSessionModule,
    LoggerModule,
    LlmMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
