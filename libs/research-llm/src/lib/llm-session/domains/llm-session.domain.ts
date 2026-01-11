import { BaseDomain } from '@libs/shared';

export class LlmSession extends BaseDomain {
  readonly userId: string;
  readonly title: string;
  isDraft: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

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
    title: string | null;
    isDraft: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): LlmSession {
    return new LlmSession({
      id: data.id,
      userId: data.userId,
      title: data.title ?? '',
      isDraft: data.isDraft,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  checkOwnership(userId: string): boolean {
    return this.userId === userId;
  }

  isDraftSession(): boolean {
    return this.isDraft;
  }

  publish() {
    this.isDraft = false;
  }
}
