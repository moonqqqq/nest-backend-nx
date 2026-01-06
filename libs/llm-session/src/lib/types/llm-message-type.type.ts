export const LlmMessageType = {
  USER: 'USER',
  AI: 'AI',
  SYSTEM: 'SYSTEM',
} as const;

export type TLlmMessageType =
  (typeof LlmMessageType)[keyof typeof LlmMessageType];
