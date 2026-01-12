import { registerAs } from '@nestjs/config';

export default registerAs('eventStream', () => ({
  kafka: {
    brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
    clientId: process.env.KAFKA_CLIENT_ID || 'my-app',
  },
  producer: {
    // 파티셔너 타입: 'default' (v2.0 기본값) 또는 'legacy' (v1.x 호환)
    createPartitioner: process.env.KAFKA_PRODUCER_PARTITIONER || 'default',
    // 메시지 전송 확인 수준: 0(없음), 1(리더만), -1(모든 복제본)
    acks: parseInt(process.env.KAFKA_PRODUCER_ACKS || '-1', 10) as -1 | 0 | 1,
    // 재시도 횟수 (네트워크 장애 등 일시적 오류 대응)
    retries: parseInt(process.env.KAFKA_PRODUCER_RETRIES || '5', 10),
    // 중복 전송 방지 (acks=-1, retries>0 일 때 권장)
    idempotent: process.env.KAFKA_PRODUCER_IDEMPOTENT !== 'false',
    // 요청 타임아웃 (ms)
    timeout: parseInt(process.env.KAFKA_PRODUCER_TIMEOUT || '30000', 10),
    // 토픽 자동 생성 허용 여부 (운영환경에서는 false 권장)
    allowAutoTopicCreation:
      process.env.KAFKA_PRODUCER_AUTO_CREATE_TOPIC !== 'false',
  },
}));
