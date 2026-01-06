import { LlmMessage } from '@libs/llm-session';

export abstract class ILlmMessageService {
  abstract create(
    userId: string,
    llmSessionId: string,
    content: string,
  ): Promise<LlmMessage>;
}
