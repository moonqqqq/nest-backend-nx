import { Module } from '@nestjs/common';
import { UserLlmMessageCreatedConsumer } from './user-llm-message-created.consumer';
import { EventStreamModule } from '@libs/event-stream';
import { LoggerModule } from '@libs/logger';
import { TaskQueueModule } from '@libs/task-queue';

@Module({
  imports: [EventStreamModule, LoggerModule, TaskQueueModule],
  providers: [UserLlmMessageCreatedConsumer],
})
export class ConsumersModule {}
