export const Topic = {
  USER_LLM_MESSAGE_CREATED: 'user-llm-message.created',
  LLM_ANSWER_MESSAGE_COMPLETED: 'llm-answer-message.completed',
} as const;

export type TTopic = (typeof Topic)[keyof typeof Topic];
