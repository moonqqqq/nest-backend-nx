import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ILoggerService } from '@libs/logger';
import { BaseExceptionFilter } from '@nestjs/core';

// TODO: microservice 구조 맞춰서 고도화
@Catch()
export class UnhandledExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: ILoggerService) {
    super();
  }

  override async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.statusCode
      ? exception.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const reqBody = req?.body ? JSON.stringify(req.body) : '';

    // Send alert here or in logging server
    this.logger.error(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      `[${new Date()}] [${req.method}] ${req.url}/ body:${reqBody} / code: ${exception} - ${exception.stack}}`,
    );

    res.status(status).json(exception);
  }
}
