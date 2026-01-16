export const KafkaProducerConstant = {
  LLM_MESSAGE_PRODUCER: 'llm-message-producer',
} as const;

export type TKafkaProducer =
  (typeof KafkaProducerConstant)[keyof typeof KafkaProducerConstant];
