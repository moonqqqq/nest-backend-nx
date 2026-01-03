/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigType } from '@nestjs/config';
import { ServiceConfig } from '@libs/config';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ILoggerService } from '@libs/logger';
import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { AllExceptionForMicroserviceFilter } from '@libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(ILoggerService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errorInfos = validationErrors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints),
        }));

        return new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'VALIDATION_ERROR_TEST',
          message: 'Validation error',
          details: errorInfos,
        });
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionForMicroserviceFilter());

  const serviceConfig = app.get<ConfigType<typeof ServiceConfig>>(
    ServiceConfig.KEY,
  );

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        port: parseInt(serviceConfig.user.tcpPort),
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  logger.info(
    `🚀 USER SERVICE is running on TCP: ${serviceConfig.user.tcpPort}`,
  );
}

bootstrap();
