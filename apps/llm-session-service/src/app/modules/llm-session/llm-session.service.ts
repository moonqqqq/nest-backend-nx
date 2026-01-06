import { Injectable } from '@nestjs/common';
import { ILlmSessionService } from './interfaces/llm-session-service.interface';
import { LlmSession } from '@libs/llm-session';
import { ILlmSessionRepository } from './interfaces/llm-session-repository.interface';
import { WrongId } from '@libs/shared';

@Injectable()
export class LlmSessionService implements ILlmSessionService {
  constructor(private readonly llmSessionRepository: ILlmSessionRepository) {}

  async create(userId: string): Promise<LlmSession> {
    const llmSession = new LlmSession({
      userId,
      isDraft: true,
    });

    return await this.llmSessionRepository.create(llmSession);
  }

  async getLlmSessions(userId: string): Promise<LlmSession[]> {
    return await this.llmSessionRepository.getLlmSessions(userId);
  }

  async checkAuth(userId: string, llmSessionId: string): Promise<boolean> {
    const llmSession =
      await this.llmSessionRepository.getLlmSessionById(llmSessionId);

    if (!llmSession) throw new WrongId({ llmSessionId });

    return llmSession.checkOwnership(userId);
  }
}
