import { LlmMessage } from '../domains/llm-message.domain';

export abstract class ILlmMessageRepository {
  abstract create(llmMessage: LlmMessage): Promise<LlmMessage>;
  abstract getLlmMessages(llmSessionId: string): Promise<LlmMessage[]>;
}
