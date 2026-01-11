import { registerAs } from '@nestjs/config';

export default registerAs('eventStream', () => ({
  kafka: {
    brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
    clientId: process.env.KAFKA_CLIENT_ID || 'my-app',
  },
}));
