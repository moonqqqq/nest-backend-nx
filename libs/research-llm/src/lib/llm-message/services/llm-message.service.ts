import { Injectable } from '@nestjs/common';
import { ILlmMessageService } from '../interfaces/llm-message-service.interface';
import { ILlmMessageRepository } from '../interfaces/llm-message-repository.interface';
import { LlmMessage } from '../domains/llm-message.domain';
import { LlmMessageType } from '../types/llm-message-type.type';
import { ILlmSessionService } from '../../llm-session/interfaces/llm-session-service.interface';
import { EventStreamProducerService } from '@libs/event-stream';
import { AppEvent, AppEventType } from '@libs/shared';

@Injectable()
export class LlmMessageService implements ILlmMessageService {
  constructor(
    private readonly llmMessageRepository: ILlmMessageRepository,
    private readonly llmSessionService: ILlmSessionService,
    private readonly eventStreamProducerService: EventStreamProducerService,
  ) {}

  async create(
    userId: string,
    llmSessionId: string,
    content: string,
  ): Promise<LlmMessage> {
    const llmSession = await this.llmSessionService.checkAuth(
      userId,
      llmSessionId,
    );

    const llmMessage = new LlmMessage({
      llmSessionId: llmSession.getId(),
      type: LlmMessageType.USER,
      content,
    });

    if (llmSession.isDraftSession()) {
      await this.llmSessionService.publish(llmSession);
    }

    const createdLlmMessage =
      await this.llmMessageRepository.create(llmMessage);

    const llmMessageCreatedEvent = new AppEvent({
      type: AppEventType.LLM_MESSAGE_CREATED,
      data: createdLlmMessage,
    });

    await this.eventStreamProducerService.send(llmMessageCreatedEvent);

    return createdLlmMessage;
  }

  async getLlmMessages(
    userId: string,
    llmSessionId: string,
  ): Promise<LlmMessage[]> {
    await this.llmSessionService.checkAuth(userId, llmSessionId);

    return await this.llmMessageRepository.getLlmMessages(llmSessionId);
  }
}
