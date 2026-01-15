import {
  ConsumerConfig,
  EachBatchPayload,
  EachMessagePayload,
  KafkaConfig,
  ProducerConfig,
  RecordMetadata,
} from 'kafkajs';
import { TTopic } from '../constants/topic.constant';
import { AppEvent } from '@libs/shared';

export interface KafkaModuleOption extends KafkaConfig {
  producer?: ProducerConfig;
  // 브로커 설정 (brokers, clientId 등)
}

// Producer 팩토리 옵션
export interface CustomProducerOptions {
  name: string; // Producer 식별자
  config?: {
    allowAutoTopicCreation?: boolean;
    idempotent?: boolean;
    transactionTimeout?: number;
    retries?: number;
    createPartitioner?: 'legacy' | 'default';
  };
}

// Producer 인스턴스 래퍼
export interface ProducerInstance {
  name: string;
  send(topic: TTopic, event: AppEvent): Promise<RecordMetadata[]>;
  disconnect(): Promise<void>;
}

// 사용자가 정의할 핸들러 타입
export type BatchHandler = (payload: EachBatchPayload) => Promise<void>;
export type MessageHandler = (payload: EachMessagePayload) => Promise<void>;

export interface CustomConsumerOptions {
  topic: string;
  config: ConsumerConfig; // groupId, sessionTimeout 등

  // 둘 중 하나는 필수
  onBatch?: BatchHandler; // 배치 처리용 핸들러
  onMessage?: MessageHandler; // 단건 처리용 핸들러

  // Consumer Run Config (autoCommit, partitionsConsumedConcurrently 등)
  runConfig: {
    autoCommit: boolean;
    eachBatchAutoResolve?: boolean;
    partitionsConsumedConcurrently?: number;
  };
}
