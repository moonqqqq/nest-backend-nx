export enum TaskQueueConstants {
  CREATE_LLM_ANSWER = 'create_llm_answer',
}

export type TTaskQueueName =
  (typeof TaskQueueConstants)[keyof typeof TaskQueueConstants];
