import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  override catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail: any = exception.getResponse();
    return res.status(exception.getStatus()).json({
      message: detail?.message ?? exception.message,
    });
  }
}
