import { LlmSession } from '../domains/llm-session.domain';

export abstract class ILlmSessionRepository {
  abstract create(llmSession: LlmSession): Promise<LlmSession>;
  abstract update(llmSession: LlmSession): Promise<LlmSession>;
  abstract getLlmSessions(userId: string): Promise<LlmSession[]>;
  abstract getLlmSessionById(llmSessionId: string): Promise<LlmSession | null>;
}
