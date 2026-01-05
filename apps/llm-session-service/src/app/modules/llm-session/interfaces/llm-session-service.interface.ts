import { LlmSession } from '@libs/llm-session';

export abstract class ILlmSessionService {
  abstract create(userId: string): Promise<LlmSession>;
}
