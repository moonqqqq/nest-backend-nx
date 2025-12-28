import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  AuthenticationException,
  AuthorizationException,
  BadInputException,
  DuplicateException,
  ServiceException,
} from '../exceptions/service-layer.exception';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(ServiceException)
export class ServiceExceptionToHttpExceptionFilter extends BaseExceptionFilter {
  override catch(exception: ServiceException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof AuthenticationException)
      status = HttpStatus.UNAUTHORIZED;
    if (exception instanceof AuthorizationException)
      status = HttpStatus.UNAUTHORIZED;
    if (exception instanceof BadInputException) status = HttpStatus.BAD_REQUEST;
    if (exception instanceof DuplicateException) status = HttpStatus.CONFLICT;

    res.status(status).json({
      // errorCode: exception.errorCode,
      message: exception.message,
    });
  }
}
