export const AppEventType = {
  LLM_MESSAGE_CREATED: 'LLM_MESSAGE_CREATED',
  LLM_ANSWER_MESSAGE_RECEIVED: 'LLM_ANSWER_MESSAGE_RECEIVED',
} as const;

export type TAppEventType = (typeof AppEventType)[keyof typeof AppEventType];
