import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, RecordMetadata, Partitioners } from 'kafkajs';
import { ILoggerService } from '@libs/logger';
import { EventStreamConfig } from '@libs/config';
import { ConfigType } from '@nestjs/config';
import { AppEvent } from '@libs/shared';
import { TTopic } from './constants/topic.constant';

@Injectable()
export class EventStreamProducerService
  implements OnModuleInit, OnModuleDestroy
{
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    @Inject(EventStreamConfig.KEY)
    private eventStreamConfig: ConfigType<typeof EventStreamConfig>,
    private readonly logger: ILoggerService,
  ) {
    this.kafka = new Kafka({
      clientId: this.eventStreamConfig.kafka.clientId,
      brokers: this.eventStreamConfig.kafka.brokers.split(','),
    });

    // Producer 생성 (실무용 설정 적용)
    const partitionerType = this.eventStreamConfig.producer.createPartitioner;
    const createPartitioner =
      partitionerType === 'legacy'
        ? Partitioners.LegacyPartitioner
        : Partitioners.DefaultPartitioner;

    // idempotent 모드에서는 EoS 보장을 위해 retries를 무제한으로 설정
    const isIdempotent = this.eventStreamConfig.producer.idempotent;
    const retries = isIdempotent
      ? Number.MAX_SAFE_INTEGER
      : this.eventStreamConfig.producer.retries;

    this.producer = this.kafka.producer({
      createPartitioner,
      allowAutoTopicCreation:
        this.eventStreamConfig.producer.allowAutoTopicCreation,
      idempotent: isIdempotent,
      transactionTimeout: this.eventStreamConfig.producer.timeout,
      retry: { retries },
    });
  }

  async send(topic: TTopic, event: AppEvent): Promise<RecordMetadata[]> {
    const value = JSON.stringify(event);
    this.logger.info(`Sending event to topic ${topic}: ${value}`);
    try {
      return await this.producer.send({
        topic,
        messages: [{ value }],
      });
    } catch (error) {
      this.logger.error(
        `Failed to send event to topic ${topic}: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.info('✅ Kafka Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    this.logger.info('🛑 Kafka Producer disconnected');
  }
}
