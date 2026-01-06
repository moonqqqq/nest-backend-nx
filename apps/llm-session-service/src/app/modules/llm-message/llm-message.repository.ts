import { Injectable } from '@nestjs/common';
import { ILlmMessageRepository } from './interfaces/llm-message-repository.interface';
import { LlmMessage } from '@libs/llm-session';
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
}
