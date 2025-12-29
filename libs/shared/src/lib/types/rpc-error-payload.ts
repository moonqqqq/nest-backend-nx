// rpc-error.payload.ts
export interface RpcErrorPayload {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, any>;
}
