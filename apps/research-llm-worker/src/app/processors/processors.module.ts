import { Module } from '@nestjs/common';
import { LlmAnswerProcessor } from './llm-answer.processor';
import { LoggerModule } from '@libs/logger';
import { TaskQueueModule } from '@libs/task-queue';

@Module({
  imports: [LoggerModule, TaskQueueModule],
  providers: [LlmAnswerProcessor],
})
export class ProcessorsModule {}
