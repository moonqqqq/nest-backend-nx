// event-stream.service.ts
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';
import { CustomConsumerOptions } from './interfaces/kafka-option.interface';
import { ILoggerService } from '@libs/logger';
import { EventStreamConfig } from '@libs/config';

@Injectable()
export class EventStreamConsumerService implements OnModuleDestroy {
  private kafka: Kafka;
  private consumers: Consumer[] = [];

  // ConfigService 주입
  constructor(
    private readonly logger: ILoggerService,
    @Inject(EventStreamConfig.KEY)
    private eventStreamConfig: ConfigType<typeof EventStreamConfig>,
  ) {
    // 환경변수에서 브로커 목록 가져오기 (없으면 로컬호스트 기본값)
    const brokers = this.eventStreamConfig.kafka.brokers;

    this.kafka = new Kafka({
      clientId: this.eventStreamConfig.kafka.clientId,
      brokers: brokers.split(','), // "broker1,broker2" 형태 대응
    });
  }

  // 핵심: 팩토리 메서드
  async createConsumer(options: CustomConsumerOptions): Promise<void> {
    const consumer = this.kafka.consumer(options.config);
    this.consumers.push(consumer); // 관리 목록에 추가

    // 토픽이 존재하지 않으면 자동 생성
    const admin = this.kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes(options.topic)) {
      await admin.createTopics({
        topics: [
          { topic: options.topic, numPartitions: 1, replicationFactor: 1 },
        ],
      });
      this.logger.info(`📦 Topic "${options.topic}" created automatically.`);
    }
    await admin.disconnect();

    await consumer.connect();
    await consumer.subscribe({
      topic: options.topic,
      fromBeginning: false,
    });

    // 사용자가 Batch 핸들러를 넣었는지, Message 핸들러를 넣었는지에 따라 분기
    if (options.onBatch) {
      await consumer.run({
        ...options.runConfig,
        eachBatch: options.onBatch,
      });
    } else if (options.onMessage) {
      await consumer.run({
        ...options.runConfig,
        eachMessage: options.onMessage,
      });
    } else {
      throw new Error('Either onBatch or onMessage must be provided.');
    }

    this.logger.info(
      `✅ Kafka Consumer started for topic: ${options.topic} (Group: ${options.config.groupId})`,
    );
  }

  async onModuleDestroy() {
    // 앱 종료 시 모든 컨슈머 연결 해제
    await Promise.all(this.consumers.map((c) => c.disconnect()));
  }
}
