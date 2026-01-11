import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, RecordMetadata, ProducerRecord } from 'kafkajs';
import { KafkaModuleOption } from './interfaces/kafka-option.interface';
import { ILoggerService } from '@libs/logger';

@Injectable()
export class EventStreamProducerService
  implements OnModuleInit, OnModuleDestroy
{
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    @Inject('KAFKA_MODULE_OPTIONS') options: KafkaModuleOption,
    private readonly logger: ILoggerService,
  ) {
    this.kafka = new Kafka(options);
    // Producer 생성 (idempotent: true는 중복 전송 방지에 도움됨)
    this.producer = this.kafka.producer(
      options.producer || { allowAutoTopicCreation: true },
    );
  }

  /**
   * 기본 전송 메서드 (kafkajs raw 기능)
   * 여러 메시지를 한 번에 보낼 때 사용 (Batch)
   */
  async send(record: ProducerRecord): Promise<RecordMetadata[]> {
    try {
      return await this.producer.send(record);
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
