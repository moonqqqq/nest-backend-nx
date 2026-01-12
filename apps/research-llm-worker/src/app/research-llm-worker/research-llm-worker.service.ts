import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  EventStreamConsumerProcessor,
  EventStreamConsumerService,
} from '@libs/event-stream';
import { ILoggerService } from '@libs/logger';

@Injectable()
export class ResearchLlmWorkerService
  implements EventStreamConsumerProcessor, OnModuleInit
{
  constructor(
    private readonly logger: ILoggerService,
    private readonly eventStreamConsumerService: EventStreamConsumerService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.eventStreamConsumerService.createConsumer({
      topic: 'research-llm',
      config: {
        groupId: 'research-llm-worker',
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
