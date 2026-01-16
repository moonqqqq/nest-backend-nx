import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Kafka, Producer, RecordMetadata, Partitioners } from 'kafkajs';
import { ILoggerService } from '@libs/logger';
import { EventStreamConfig } from '@libs/config';
import { AppEvent } from '@libs/shared';
import { TTopic } from './constants/topic.constant';
import {
  CustomProducerOptions,
  ProducerInstance,
} from './interfaces/kafka-option.interface';

@Injectable()
export class EventStreamProducerFactoryService implements OnModuleDestroy {
  private kafka: Kafka;
  private producers: Map<string, Producer> = new Map();

  constructor(
    private readonly logger: ILoggerService,
    @Inject(EventStreamConfig.KEY)
    private eventStreamConfig: ConfigType<typeof EventStreamConfig>,
  ) {
    this.kafka = new Kafka({
      clientId: this.eventStreamConfig.kafka.clientId,
      brokers: this.eventStreamConfig.kafka.brokers.split(','),
    });
  }

  async createProducer(
    options: CustomProducerOptions,
  ): Promise<ProducerInstance> {
    if (this.producers.has(options.name)) {
      throw new Error(`Producer with name "${options.name}" already exists.`);
    }

    const config = options.config ?? {};

    // Partitioner 설정
    const partitionerType = config.createPartitioner ?? 'default';
    const createPartitioner =
      partitionerType === 'legacy'
        ? Partitioners.LegacyPartitioner
        : Partitioners.DefaultPartitioner;

    // idempotent 모드에서는 EoS 보장을 위해 retries를 무제한으로 설정
    const isIdempotent = config.idempotent ?? false;
    const retries = isIdempotent
      ? Number.MAX_SAFE_INTEGER
      : (config.retries ?? 5);

    // acks 설정: 프로듀서별로 다르게 설정 가능 (기본값: 전역 설정 또는 -1)
    const producerAcks = config.acks ?? -1;

    const producer = this.kafka.producer({
      createPartitioner,
      allowAutoTopicCreation: config.allowAutoTopicCreation ?? true,
      idempotent: isIdempotent,
      transactionTimeout: config.transactionTimeout ?? 30000,
      retry: { retries },
    });

    await producer.connect();
    this.producers.set(options.name, producer);

    this.logger.info(`✅ Kafka Producer "${options.name}" connected`);

    // Producer 인스턴스 래퍼 반환
    const instance: ProducerInstance = {
      name: options.name,
      send: async (
        topic: TTopic,
        event: AppEvent,
      ): Promise<RecordMetadata[]> => {
        const value = JSON.stringify(event);
        this.logger.info(
          `[${options.name}] Sending event to topic ${topic}: ${value}`,
        );
        try {
          return await producer.send({
            topic,
            messages: [{ value }],
            acks: producerAcks,
          });
        } catch (error) {
          this.logger.error(
            `[${options.name}] Failed to send event to topic ${topic}: ${(error as Error).message}`,
          );
          throw error;
        }
      },
      disconnect: async (): Promise<void> => {
        await producer.disconnect();
        this.producers.delete(options.name);
        this.logger.info(`🛑 Kafka Producer "${options.name}" disconnected`);
      },
    };

    return instance;
  }

  getProducer(name: string): Producer | undefined {
    return this.producers.get(name);
  }

  async onModuleDestroy() {
    await Promise.all(
      Array.from(this.producers.entries()).map(async ([name, producer]) => {
        await producer.disconnect();
        this.logger.info(`🛑 Kafka Producer "${name}" disconnected`);
      }),
    );
    this.producers.clear();
  }
}
