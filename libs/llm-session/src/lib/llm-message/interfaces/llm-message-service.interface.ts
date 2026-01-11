import { LlmMessage } from '../domains/llm-message.domain';

export abstract class ILlmMessageService {
  abstract create(
    userId: string,
    llmSessionId: string,
    content: string,
  ): Promise<LlmMessage>;
  abstract getLlmMessages(
    userId: string,
    llmSessionId: string,
  ): Promise<LlmMessage[]>;
}
