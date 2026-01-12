import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  Kafka,
  Producer,
  RecordMetadata,
  ProducerRecord,
  Partitioners,
} from 'kafkajs';
import { ILoggerService } from '@libs/logger';
import { EventStreamConfig } from '@libs/config';
import { ConfigType } from '@nestjs/config';

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

  /**
   * 기본 전송 메서드 (kafkajs raw 기능)
   * 여러 메시지를 한 번에 보낼 때 사용 (Batch)
   */
  async send(record: ProducerRecord): Promise<RecordMetadata[]> {
    try {
      return await this.producer.send({
        ...record,
        acks: this.eventStreamConfig.producer.acks,
        timeout: this.eventStreamConfig.producer.timeout,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send message to topic ${record.topic}: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  /**
   * [편의 기능] 단건 JSON 전송 헬퍼
   * 객체를 넣으면 자동으로 JSON.stringify 처리 및 Key 설정
   */
  async sendJson<T = any>(
    topic: string,
    data: T,
    key?: string,
  ): Promise<RecordMetadata[]> {
    return this.send({
      topic,
      messages: [
        {
          key, // 파티션 순서 보장이 필요하면 key 필수
          value: JSON.stringify(data),
        },
      ],
    });
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
