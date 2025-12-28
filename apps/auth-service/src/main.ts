/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ServiceConfig } from '@libs/config';
import { ConfigType } from '@nestjs/config';
import { HttpExceptionFilter, PrismaClientExceptionFilter, ServiceExceptionToHttpExceptionFilter, UnhandledExceptionFilter } from '@libs/shared';
import { ILoggerService } from '@libs/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(ILoggerService);
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new UnhandledExceptionFilter(logger));
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());
  
  const serviceConfig = app.get<ConfigType<typeof ServiceConfig>>(ServiceConfig.KEY);
  await app.listen(serviceConfig.auth.port);
  logger.info(
    `🚀 AUTH SERVICE is running on: ${serviceConfig.auth.port}`,
  );
}

bootstrap();
