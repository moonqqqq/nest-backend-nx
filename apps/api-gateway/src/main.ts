import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ServiceConfig } from '@libs/config';
import { ConfigType } from '@nestjs/config';
import { HttpExceptionFilter, UnhandledExceptionFilter } from '@libs/shared';
import { ILoggerService } from '@libs/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(ILoggerService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new UnhandledExceptionFilter(logger));
  app.useGlobalFilters(new HttpExceptionFilter());

  const serviceConfig = app.get<ConfigType<typeof ServiceConfig>>(
    ServiceConfig.KEY,
  );

  const port = serviceConfig.gateway.port;
  await app.listen(port);
  logger.info(`🚀 API GATEWAY is running on: ${port}`);
}

bootstrap();
