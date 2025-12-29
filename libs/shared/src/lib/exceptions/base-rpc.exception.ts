// base-rpc.exception.ts
import { RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from '../types/rpc-error-payload';

export abstract class BaseRpcException extends RpcException {
  readonly payload: RpcErrorPayload;

      protected constructor(payload: RpcErrorPayload) {
    super(payload);
    this.payload = payload;
  }
}
