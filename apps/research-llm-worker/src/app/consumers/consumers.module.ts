import { Module } from '@nestjs/common';
import { LlmMessageConsumer } from './llm-message.consumer';
import { EventStreamModule } from '@libs/event-stream';
import { LoggerModule } from '@libs/logger';
import { TaskQueueModule } from '@libs/task-queue';

@Module({
  imports: [EventStreamModule, LoggerModule, TaskQueueModule],
  providers: [LlmMessageConsumer],
})
export class ConsumersModule {}
