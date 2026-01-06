import { Injectable } from '@nestjs/common';
import { ILlmSessionService } from './interfaces/llm-session-service.interface';
import { LlmSession } from '@libs/llm-session';
import { ILlmSessionRepository } from './interfaces/llm-session-repository.interface';
import { NotOwner, WrongId } from '@libs/shared';

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

  async checkAuth(userId: string, llmSessionId: string): Promise<LlmSession> {
    const llmSession =
      await this.llmSessionRepository.getLlmSessionById(llmSessionId);

    if (!llmSession) throw new WrongId({ llmSessionId });

    if (!llmSession.checkOwnership(userId))
      throw new NotOwner({ llmSessionId });

    return llmSession;
  }

  async publish(llmSession: LlmSession): Promise<LlmSession> {
    llmSession.publish();
    return await this.llmSessionRepository.update(llmSession);
  }

  async update(llmSession: LlmSession): Promise<LlmSession> {
    return await this.llmSessionRepository.update(llmSession);
  }
}
