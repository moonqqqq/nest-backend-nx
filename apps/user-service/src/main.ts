/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigType } from '@nestjs/config';
import { ServiceConfig } from '@libs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ILoggerService } from '@libs/logger';
import { UnhandledExceptionFilter } from '@libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(ILoggerService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new UnhandledExceptionFilter(logger));

  const serviceConfig = app.get<ConfigType<typeof ServiceConfig>>(
    ServiceConfig.KEY,
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: parseInt(serviceConfig.user.tcpPort),
    },
  });

  await app.startAllMicroservices();
  logger.info(
    `🚀 USER SERVICE is running on TCP: ${serviceConfig.user.tcpPort}`,
  );
}

bootstrap();
