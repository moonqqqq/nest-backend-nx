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

    // 1. 마이크로서비스에서 온 에러(exception.error)인지, 일반 에러인지 확인하여 데이터 추출
    // RpcException으로 전달하다보니 error에 값들이 들어감.
    const errorResponse = exception.error || exception;

    // 2. 추출된 데이터에서 상태 코드 결정
    const status = errorResponse.statusCode
      ? errorResponse.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const reqBody = req?.body ? JSON.stringify(req.body) : '';

    this.logger.error(
      `[${new Date()}] [${req.method}] ${req.url} body:${reqBody} / error: ${JSON.stringify(errorResponse)}`,
    );

    // 3. 중첩된 exception 대신 실제 에러 데이터(errorResponse)만 반환
    res.status(status).json(errorResponse);
  }
}
