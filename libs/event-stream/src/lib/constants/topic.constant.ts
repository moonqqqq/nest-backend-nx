export const Topic = {
  USER_LLM_MESSAGE_CREATED: 'user-llm-message.created',
  LLM_ANSWER_MESSAGE_COMPLETED: 'llm-answer-message.completed',
  LLM_ANSWER_FAILED: 'llm-answer-message.failed', // DLQ 용
} as const;

export type TTopic = (typeof Topic)[keyof typeof Topic];
