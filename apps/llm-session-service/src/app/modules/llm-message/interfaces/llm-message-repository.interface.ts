import { LlmMessage } from '@libs/llm-session';

export abstract class ILlmMessageRepository {
  abstract create(llmMessage: LlmMessage): Promise<LlmMessage>;
}
