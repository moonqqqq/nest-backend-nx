import { Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class AllExceptionForMicroserviceFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'rpc') {
      throw exception;
    }

    // 이미 RpcException 이면 그대로 통과
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    const rpcCtx = host.switchToRpc();
    const input = rpcCtx.getData(); // DTO
    const message = (exception as any).message;
    const stack = (exception as any).stack;

    return throwError(
      () =>
        new RpcException({
          statusCode: 500,
          code: (exception as any).code ?? 'INTERNAL_ERROR',
          message,
          details: {
            input,
            stack,
          },
        }),
    );
  }
}
