export const KafkaGroup = {
  RESEARCH_LLM_WORKER: 'research-llm-worker-group',
} as const;

export type TKafkaGroup = (typeof KafkaGroup)[keyof typeof KafkaGroup];
