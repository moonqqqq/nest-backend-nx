import { registerAs } from '@nestjs/config';

export default registerAs('services', () => ({
  user: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    port: process.env.USER_SERVICE_PORT || '3001',
    tcpPort: process.env.USER_SERVICE_TCP_PORT || '3011',
  },
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
    port: process.env.AUTH_SERVICE_PORT || '3002',
    tcpPort: process.env.AUTH_SERVICE_TCP_PORT || '3012',
  },
}));
