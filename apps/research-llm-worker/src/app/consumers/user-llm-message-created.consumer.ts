import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  EventStreamConsumerFactoryService,
  IEventStreamConsumer,
  KafkaGroup,
  Topic,
} from '@libs/event-stream';
import { ILoggerService } from '@libs/logger';
import { AppEvent, TAppEventType } from '@libs/shared';
import { TaskQueueService, TaskQueueConstants } from '@libs/task-queue';

@Injectable()
export class UserLlmMessageCreatedConsumer
  implements IEventStreamConsumer, OnModuleInit
{
  constructor(
    private readonly logger: ILoggerService,
    private readonly eventStreamConsumerFactoryService: EventStreamConsumerFactoryService,
    private readonly taskQueueService: TaskQueueService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.eventStreamConsumerFactoryService.createConsumer({
      topic: Topic.USER_LLM_MESSAGE_CREATED,
      config: {
        groupId: KafkaGroup.RESEARCH_LLM,
      },
      onMessage: async ({ message }) => {
        await this.process(message);
      },
      runConfig: {
        autoCommit: false,
      },
    });
  }

  async process(message: any): Promise<void> {
    this.logger.info(`Received event: ${message.value.toString()}`);
    const event = JSON.parse(message.value.toString());

    const appEvent = new AppEvent({
      type: event.type as TAppEventType,
      data: event.data,
      id: event.id,
      retry: event.retry,
    });

    await this.taskQueueService.enqueue(
      TaskQueueConstants.CREATE_LLM_ANSWER,
      appEvent,
    );
  }
}
