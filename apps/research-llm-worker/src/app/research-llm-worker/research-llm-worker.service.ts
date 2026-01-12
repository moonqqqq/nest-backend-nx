import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  EventStreamConsumerService,
  IEventStreamConsumer,
  KafkaGroup,
} from '@libs/event-stream';
import { ILoggerService } from '@libs/logger';
import { AppEventType } from '@libs/shared';

@Injectable()
export class ResearchLlmWorkerService
  implements IEventStreamConsumer, OnModuleInit
{
  constructor(
    private readonly logger: ILoggerService,
    private readonly eventStreamConsumerService: EventStreamConsumerService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.eventStreamConsumerService.createConsumer({
      topic: AppEventType.LLM_MESSAGE_CREATED,
      config: {
        groupId: KafkaGroup.RESEARCH_LLM_WORKER,
      },
      onMessage: async ({ message }) => {
        await this.process(message);
      },
    });
  }

  async process(message: any): Promise<void> {
    this.logger.info(`Received message: ${message.value?.toString()}`);
  }
}
