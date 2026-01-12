import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ResearchLlmWorkerModule } from './research-llm-worker/research-llm-worker.module';

@Module({
  imports: [ResearchLlmWorkerModule],
  providers: [AppService],
})
export class AppModule {}
