import { LlmSession } from '@libs/llm-session';

export abstract class ILlmSessionService {
  abstract create(userId: string): Promise<LlmSession>;
  abstract update(llmSession: LlmSession): Promise<LlmSession>;
  abstract getLlmSessions(userId: string): Promise<LlmSession[]>;
  abstract checkAuth(userId: string, llmSessionId: string): Promise<LlmSession>;
  abstract publish(llmSession: LlmSession): Promise<LlmSession>;
}
