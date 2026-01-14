import { Module } from '@nestjs/common';
import { ResearchLlmWorkerService } from './research-llm-worker.service';
import { EventStreamModule } from '@libs/event-stream';
import { LoggerModule } from '@libs/logger';
import { TaskQueueModule } from '@libs/task-queue';

@Module({
  imports: [EventStreamModule, LoggerModule, TaskQueueModule],
  providers: [ResearchLlmWorkerService],
})
export class ResearchLlmWorkerModule {}
