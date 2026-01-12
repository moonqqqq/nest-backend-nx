export const KafkaGroup = {
  RESEARCH_LLM: 'research-llm',
} as const;

export type TKafkaGroup = (typeof KafkaGroup)[keyof typeof KafkaGroup];
