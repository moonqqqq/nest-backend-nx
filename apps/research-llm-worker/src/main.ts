/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Graceful shutdown 처리
  app.enableShutdownHooks();

  Logger.log(
    `🚀 Research LLM Worker is running and listening for Kafka messages...`,
  );
}

bootstrap();
