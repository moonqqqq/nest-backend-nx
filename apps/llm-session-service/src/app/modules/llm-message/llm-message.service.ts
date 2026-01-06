import { Injectable } from '@nestjs/common';
import { ILlmMessageService } from './interfaces/llm-message-service.interface';
import { ILlmMessageRepository } from './interfaces/llm-message-repository.interface';
import { LlmMessage } from '@libs/llm-session';
import { LlmMessageType } from '@libs/llm-session';
import { ILlmSessionService } from '../llm-session/interfaces/llm-session-service.interface';

@Injectable()
export class LlmMessageService implements ILlmMessageService {
  constructor(
    private readonly llmMessageRepository: ILlmMessageRepository,
    private readonly llmSessionService: ILlmSessionService,
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

    return await this.llmMessageRepository.create(llmMessage);
  }

  async getLlmMessages(
    userId: string,
    llmSessionId: string,
  ): Promise<LlmMessage[]> {
    await this.llmSessionService.checkAuth(userId, llmSessionId);

    return await this.llmMessageRepository.getLlmMessages(llmSessionId);
  }
}
