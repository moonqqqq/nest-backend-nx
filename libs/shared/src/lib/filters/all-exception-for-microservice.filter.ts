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
    const payload = rpcCtx.getData(); // DTO

    return throwError(
      () =>
        new RpcException({
          statusCode: 500,
          code: (exception as any)['code'] ?? 'INTERNAL_ERROR',
          message:
            exception instanceof Error ? exception.message : 'Unknown error',
          details: {
            payload,
            // context는 필요한 것만
          },
        }),
    );
  }
}
