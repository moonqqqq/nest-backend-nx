import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  EventStreamConsumerService,
  IEventStreamConsumer,
  KafkaGroup,
  Topic,
} from '@libs/event-stream';
import { ILoggerService } from '@libs/logger';

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
      topic: Topic.USER_LLM_MESSAGE_CREATED,
      config: {
        groupId: KafkaGroup.RESEARCH_LLM,
      },
      onMessage: async ({ message }) => {
        await this.process(message);
      },
    });
  }

  async process(message: any): Promise<void> {
    this.logger.info(`Received event: ${message.value?.toString()}`);
  }
}
