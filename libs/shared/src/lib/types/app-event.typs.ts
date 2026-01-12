export const AppEventType = {
  LLM_MESSAGE_CREATED: 'llm_message_created',
  LLM_ANSWER_MESSAGE_COMPLETED: 'llm_answer_message_completed',

  // stream event
  STREAM_STARTED: 'stream_started',
  STREAM_INTERNAL_THINKING: 'stream_internal_thinking',
  STREAM_MESSAGE: 'stream_message',
  STREAM_COMPLETED: 'stream_completed',
  STREAM_FAILED: 'stream_failed',
} as const;

export type TAppEventType = (typeof AppEventType)[keyof typeof AppEventType];
