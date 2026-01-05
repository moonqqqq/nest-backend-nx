import { BaseDomain } from '@libs/shared';

export class LlmSession extends BaseDomain {
  public readonly userId: string;
  public readonly title: string;
  public readonly isDraft: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(payload: {
    id?: string;
    userId: string;
    title?: string;
    isDraft: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(payload.id);
    this.userId = payload.userId;
    this.title = payload.title ?? '';
    this.isDraft = payload.isDraft;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  static fromEntity(data: {
    id: string;
    userId: string;
    title: string;
    isDraft: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): LlmSession {
    return new LlmSession({
      id: data.id,
      userId: data.userId,
      title: data.title,
      isDraft: data.isDraft,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
