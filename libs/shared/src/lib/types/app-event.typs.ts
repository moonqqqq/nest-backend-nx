export const AppEventType = {
  LLM_MESSAGE_CREATED: 'llm_message_created',
  LLM_ANSWER_MESSAGE_RECEIVED: 'llm_answer_message_received',

  // stream event
  STREAM_STARTED: 'stream_started',
  STREAM_MESSAGE: 'stream_message',
  STREAM_COMPLETED: 'stream_completed',
  STREAM_FAILED: 'stream_failed',
} as const;

export type TAppEventType = (typeof AppEventType)[keyof typeof AppEventType];
