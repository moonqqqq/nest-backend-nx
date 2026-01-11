import { Injectable } from '@nestjs/common';
import { ILlmMessageRepository } from '../interfaces/llm-message-repository.interface';
import { LlmMessage } from '../domains/llm-message.domain';
import { PrismaService } from '@libs/database';

@Injectable()
export class LlmMessageRepository implements ILlmMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(llmMessage: LlmMessage): Promise<LlmMessage> {
    const createdLlmMessageEntity = await this.prisma.llmMessageEntity.create({
      data: {
        type: llmMessage.type,
        content: llmMessage.content,
        llmSession: {
          connect: {
            id: llmMessage.llmSessionId,
          },
        },
      },
    });

    return LlmMessage.fromEntity(createdLlmMessageEntity);
  }

  async getLlmMessages(llmSessionId: string): Promise<LlmMessage[]> {
    const llmMessages = await this.prisma.llmMessageEntity.findMany({
      where: { llmSessionId },
      orderBy: { createdAt: 'asc' },
    });

    return llmMessages.map(LlmMessage.fromEntity);
  }
}
