import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PrismaErrorCodes } from '../constants/prisma';

export const PrismaErrorBody = {
  DUPLICATE_INPUT: {
    errorCode: 'DUPLICATE_INPUT',
    // message: 'loginId is Already used',
  },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const message = exception.message.replace(/\n/g, '');

    if (exception.code === PrismaErrorCodes.UNIQUE_INDEX_CONFLICT) {
      const status = HttpStatus.CONFLICT;

      return response.status(status).json({
        errorCode: 'DUPLICATE_INPUT',
        message: `${exception?.meta?.target} is already used`,
      });
    }
    // set Alert to developer
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
  }
}
