import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ResearchLlmWorkerModule } from './research-llm-worker/research-llm-worker.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, EventStreamConfig, ServiceConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig, EventStreamConfig],
    }),
    ResearchLlmWorkerModule,
  ],
  providers: [AppService],
})
export class AppModule {}
