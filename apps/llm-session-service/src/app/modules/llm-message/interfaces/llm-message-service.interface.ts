import { LlmMessage } from '@libs/llm-session';

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
