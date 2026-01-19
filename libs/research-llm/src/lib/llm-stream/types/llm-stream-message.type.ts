export enum LlmStreamMessageType {
  CHUNK = 'chunk',
  DONE = 'done',
  ERROR = 'error',
}

export interface LlmStreamMessage {
  type: LlmStreamMessageType;
  content?: string;
  error?: string;
}
