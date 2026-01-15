import { Injectable, OnModuleInit } from '@nestjs/common';
import { ILlmMessageService } from '../interfaces/llm-message-service.interface';
import { ILlmMessageRepository } from '../interfaces/llm-message-repository.interface';
import { LlmMessage } from '../domains/llm-message.domain';
import { LlmMessageType } from '../types/llm-message-type.type';
import { ILlmSessionService } from '../../llm-session/interfaces/llm-session-service.interface';
import {
  EventStreamProducerFactoryService,
  ProducerInstance,
} from '@libs/event-stream';
import { AppEvent, AppEventType } from '@libs/shared';
import { Topic } from '@libs/event-stream';

@Injectable()
export class LlmMessageService implements ILlmMessageService, OnModuleInit {
  private producer!: ProducerInstance;

  constructor(
    private readonly llmMessageRepository: ILlmMessageRepository,
    private readonly llmSessionService: ILlmSessionService,
    private readonly eventStreamProducerFactory: EventStreamProducerFactoryService,
  ) {}

  async onModuleInit() {
    this.producer = await this.eventStreamProducerFactory.createProducer({
      name: 'llm-message-producer',
      config: {
        idempotent: true,
        allowAutoTopicCreation: false,
      },
    });
  }

  async create(
    userId: string,
    llmSessionId: string,
    content: string,
  ): Promise<{
    createdLlmQuestionMessage: LlmMessage;
    createdLlmAnswerMessage: LlmMessage;
  }> {
    const llmSession = await this.llmSessionService.checkAuth(
      userId,
      llmSessionId,
    );

    const llmQuestionMessage = new LlmMessage({
      llmSessionId: llmSession.getId(),
      type: LlmMessageType.USER,
      content,
    });

    const llmAnswerMessage = new LlmMessage({
      llmSessionId: llmSession.getId(),
      type: LlmMessageType.AI,
      content: '',
    });

    if (llmSession.isDraftSession()) {
      await this.llmSessionService.publish(llmSession);
    }

    const createdLlmQuestionMessage =
      await this.llmMessageRepository.create(llmQuestionMessage);
    const createdLlmAnswerMessage =
      await this.llmMessageRepository.create(llmAnswerMessage);

    const llmMessageCreatedEvent = new AppEvent({
      type: AppEventType.LLM_MESSAGE_CREATED,
      data: {
        question: createdLlmQuestionMessage.getMessage(),
        answerMessageId: createdLlmAnswerMessage.getId(),
      },
    });

    await this.producer.send(
      Topic.USER_LLM_MESSAGE_CREATED,
      llmMessageCreatedEvent,
    );

    return { createdLlmQuestionMessage, createdLlmAnswerMessage };
  }

  async getLlmMessages(
    userId: string,
    llmSessionId: string,
  ): Promise<LlmMessage[]> {
    await this.llmSessionService.checkAuth(userId, llmSessionId);

    return await this.llmMessageRepository.getLlmMessages(llmSessionId);
  }
}
