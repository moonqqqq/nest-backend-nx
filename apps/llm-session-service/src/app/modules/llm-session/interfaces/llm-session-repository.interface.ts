import { LlmSession } from '@libs/llm-session';

export abstract class ILlmSessionRepository {
  abstract create(llmSession: LlmSession): Promise<LlmSession>;
  abstract getLlmSessions(userId: string): Promise<LlmSession[]>;
}
