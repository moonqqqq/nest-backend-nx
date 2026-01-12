import { BaseDomain } from '@libs/shared';
import { TLlmMessageType } from '../types/llm-message-type.type';

export class LlmMessage extends BaseDomain {
  public readonly type: TLlmMessageType;
  public readonly content: string;
  public readonly llmSessionId: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(payload: {
    id?: string;
    llmSessionId: string;
    type: TLlmMessageType;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(payload.id);
    this.llmSessionId = payload.llmSessionId;
    this.type = payload.type;
    this.content = payload.content;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  static fromEntity(data: {
    id: string;
    llmSessionId: string;
    type: TLlmMessageType;
    content: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): LlmMessage {
    return new LlmMessage({
      id: data.id,
      llmSessionId: data.llmSessionId,
      type: data.type,
      content: data.content ?? '',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  getMessage(): string {
    return this.content;
  }
}
