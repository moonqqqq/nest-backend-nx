/**
 * all the exception below catched by ServiceExceptionToHttpExceptionFilter
 */

import { HttpStatus } from '@nestjs/common';
import { BaseRpcException } from './base-rpc.exception';

export class ServiceRpcException extends BaseRpcException {
  constructor(
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    code: string,
    message = 'Internal server error',
    details?: Record<string, any>,
  ) {
    super({
      statusCode,
      code,
      message,
      details,
    });
  }
}

export class UserAlreadyExists extends ServiceRpcException {
  constructor(details?: Record<string, any>) {
    super(
      HttpStatus.CONFLICT,
      'USER_ALREADY_EXISTS',
      'User already exists',
      details || {},
    );
  }
}
