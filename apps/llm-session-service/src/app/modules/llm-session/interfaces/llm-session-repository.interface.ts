import { LlmSession } from '@libs/llm-session';

export abstract class ILlmSessionRepository {
  abstract create(llmSession: LlmSession): Promise<LlmSession>;
  abstract update(llmSession: LlmSession): Promise<LlmSession>;
  abstract getLlmSessions(userId: string): Promise<LlmSession[]>;
  abstract getLlmSessionById(llmSessionId: string): Promise<LlmSession | null>;
}
