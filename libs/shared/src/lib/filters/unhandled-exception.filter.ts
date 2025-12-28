import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ILoggerService } from '@libs/logger';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class UnhandledExceptionFilter extends BaseExceptionFilter {
  constructor(
    private readonly logger: ILoggerService,
  ) {
    super();
  }

  override async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const reqBody = req?.body ? JSON.stringify(req.body) : '';

    // Send alert here or in logging server
    this.logger.error(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      `[${new Date()}] [${req.method}] ${req.url}/ body:${reqBody} / code: ${exception} - ${(exception as any).stack}}`,
    );

    res.status(status).json(exception);
  }
}
