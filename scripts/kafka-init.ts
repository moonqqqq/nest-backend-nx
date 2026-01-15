/**
 * Kafka Topic 초기화 스크립트
 *
 * 사용법:
 *   npm run kafka:init
 *
 * 환경변수:
 *   KAFKA_BROKERS - Kafka 브로커 주소 (기본: localhost:9092)
 */

import { Kafka } from 'kafkajs';
import { TopicConfigs } from '../libs/event-stream/src/lib/configs/topic-config.constant';

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(
  ',',
);

async function initializeTopics(): Promise<void> {
  const kafka = new Kafka({
    clientId: 'kafka-init-script',
    brokers: KAFKA_BROKERS,
  });

  const admin = kafka.admin();

  try {
    console.log(`Connecting to: ${KAFKA_BROKERS.join(', ')}`);
    await admin.connect();

    const existingTopics = await admin.listTopics();
    const topicsToCreate = TopicConfigs.filter(
      (config) => !existingTopics.includes(config.name),
    );

    if (topicsToCreate.length === 0) {
      console.log('All topics already exist.');
      return;
    }

    console.log(
      `Creating topics: ${topicsToCreate.map((t) => t.name).join(', ')}`,
    );

    await admin.createTopics({
      topics: topicsToCreate.map((config) => ({
        topic: config.name,
        numPartitions: config.numPartitions,
        replicationFactor: config.replicationFactor,
      })),
    });

    console.log('Done.');
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  } finally {
    await admin.disconnect();
  }
}

initializeTopics();
