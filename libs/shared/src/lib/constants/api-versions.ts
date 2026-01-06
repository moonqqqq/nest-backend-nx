export const ApiVersion = {
  ONE: 'v1',
} as const;

export type TApiVersion = (typeof ApiVersion)[keyof typeof ApiVersion];

export const ApiEndpoint = {
  AUTH: 'auth',
  USERS: 'users',
  LLM_SESSIONS: 'llm-sessions',
  LLM_MESSAGES: 'llm-messages',
} as const;
