import { Injectable } from '@nestjs/common';
import { ILlmSessionRepository } from './interfaces/llm-session-repository.interface';
import { PrismaService } from '@libs/database';
import { LlmSession } from '@libs/llm-session';

@Injectable()
export class LlmSessionRepository implements ILlmSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(llmSession: LlmSession): Promise<LlmSession> {
    const createdLlmSessionEntity = await this.prisma.llmSessionEntity.create({
      data: {
        userId: llmSession.userId,
        title: llmSession.title,
        isDraft: llmSession.isDraft,
      },
    });

    return LlmSession.fromEntity(createdLlmSessionEntity);
  }

  async getLlmSessions(userId: string): Promise<LlmSession[]> {
    const llmSessions = await this.prisma.llmSessionEntity.findMany({
      where: { userId, isDraft: false },
      orderBy: { updatedAt: 'desc' },
    });

    return llmSessions.map(LlmSession.fromEntity);
  }
}
