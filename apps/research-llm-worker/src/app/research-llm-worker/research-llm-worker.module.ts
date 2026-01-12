import { Module } from '@nestjs/common';
import { ResearchLlmWorkerService } from './research-llm-worker.service';
import { EventStreamModule } from '@libs/event-stream';
import { LoggerModule } from '@libs/logger';

@Module({
  imports: [EventStreamModule, LoggerModule],
  providers: [ResearchLlmWorkerService],
})
export class ResearchLlmWorkerModule {}
