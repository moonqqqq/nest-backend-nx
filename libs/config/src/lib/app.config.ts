import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  port: parseInt(process.env.APP_PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',

  jwtSecret: process.env.JWT_SECRET || 'doyouwannabuildasnowman',
  jwtAccessExpire: process.env.JWT_EXPIRE_TIME_ACCESS || '30m',
  jwtRefreshExpire: process.env.JWT_EXPIRE_TIME_REFRESH || '15d',
}));
