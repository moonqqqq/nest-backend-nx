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

  async update(llmSession: LlmSession): Promise<LlmSession> {
    const updatedLlmSessionEntity = await this.prisma.llmSessionEntity.update({
      where: { id: llmSession.getId() },
      data: {
        title: llmSession.title,
        isDraft: llmSession.isDraft,
      },
    });
    return LlmSession.fromEntity(updatedLlmSessionEntity);
  }

  async getLlmSessions(userId: string): Promise<LlmSession[]> {
    const llmSessions = await this.prisma.llmSessionEntity.findMany({
      where: { userId, isDraft: false },
      orderBy: { updatedAt: 'desc' },
    });

    return llmSessions.map(LlmSession.fromEntity);
  }

  async getLlmSessionById(llmSessionId: string): Promise<LlmSession | null> {
    const llmSession = await this.prisma.llmSessionEntity.findUnique({
      where: { id: llmSessionId },
    });
    if (!llmSession) return null;
    return LlmSession.fromEntity(llmSession);
  }
}
