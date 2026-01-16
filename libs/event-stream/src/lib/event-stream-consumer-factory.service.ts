import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';
import { CustomConsumerOptions } from './interfaces/kafka-option.interface';
import { ILoggerService } from '@libs/logger';
import { AppConfig, EventStreamConfig } from '@libs/config';

@Injectable()
export class EventStreamConsumerFactoryService implements OnModuleDestroy {
  private kafka: Kafka;
  private consumers: Consumer[] = [];

  constructor(
    private readonly logger: ILoggerService,
    @Inject(EventStreamConfig.KEY)
    private eventStreamConfig: ConfigType<typeof EventStreamConfig>,
    @Inject(AppConfig.KEY)
    private appConfig: ConfigType<typeof AppConfig>,
  ) {
    const brokers = this.eventStreamConfig.kafka.brokers;
    this.kafka = new Kafka({
      clientId: this.eventStreamConfig.kafka.clientId,
      brokers: brokers.split(','),
    });
  }

  async createConsumer(options: CustomConsumerOptions): Promise<void> {
    if (this.appConfig.nodeEnv === 'dev') {
      await this.ensureTopicExists(options.topic);
    }

    const consumer = this.kafka.consumer(options.config);
    this.consumers.push(consumer);

    await consumer.connect();
    await consumer.subscribe({
      topic: options.topic,
      fromBeginning: true,
    });

    await this.runConsumer(consumer, options);

    this.logger.info(
      `Kafka Consumer started for topic: ${options.topic} (Group: ${options.config.groupId})`,
    );
  }

  private async ensureTopicExists(topic: string): Promise<void> {
    const admin = this.kafka.admin();
    await admin.connect();

    const topics = await admin.listTopics();
    if (!topics.includes(topic)) {
      await admin.createTopics({
        topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
      });
      this.logger.info(`Topic "${topic}" created automatically.`);
    }

    await admin.disconnect();
  }

  private async runConsumer(
    consumer: Consumer,
    options: CustomConsumerOptions,
  ): Promise<void> {
    if (options.onBatch) {
      await consumer.run({
        ...options.runConfig,
        eachBatch: options.onBatch,
        // eachBatchAutoResolve: true 이게 기본값 //  eachBatch는 에러가 안나면 알아서 커밋해줌(autoCommit이 false일 때).
      });
      return;
    }

    if (options.onMessage) {
      const onMessageFunction = options.onMessage;

      await consumer.run({
        ...options.runConfig,
        eachMessage: async (payload) => {
          await onMessageFunction(payload);

          // autoCommit이 false일 때만 수동 커밋 (성공 시에만 커밋됨)
          if (!options.runConfig.autoCommit) {
            await consumer.commitOffsets([
              {
                topic: payload.topic,
                partition: payload.partition,
                offset: (parseInt(payload.message.offset) + 1).toString(),
              },
            ]);
          }
        },
      });
      return;
    }

    throw new Error('Either onBatch or onMessage must be provided.');
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(this.consumers.map((c) => c.disconnect()));
  }
}
