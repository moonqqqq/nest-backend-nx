import { registerAs } from '@nestjs/config';

export default registerAs('jobQueue', () => ({
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
}));
