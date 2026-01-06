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

export class UserNotFoundException extends ServiceRpcException {
  constructor(details?: Record<string, any>) {
    super(
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
      'User not found',
      details || {},
    );
  }
}

export class InvalidPassword extends ServiceRpcException {
  constructor(details?: Record<string, any>) {
    super(
      HttpStatus.UNAUTHORIZED,
      'INVALID_PASSWORD',
      'Invalid password',
      details || {},
    );
  }
}

export class WrongId extends ServiceRpcException {
  constructor(details?: Record<string, any>) {
    super(HttpStatus.BAD_REQUEST, 'WRONG_ID', 'Wrong ID', details || {});
  }
}

export class NotOwner extends ServiceRpcException {
  constructor(details?: Record<string, any>) {
    super(HttpStatus.FORBIDDEN, 'NOT_OWNER', 'Not owner', details || {});
  }
}
