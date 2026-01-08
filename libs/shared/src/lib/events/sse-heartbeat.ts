import { interval, map } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

// 장시간 event를 보내지않을 때 끊기지 않기위해 정기적으로 ping
export const sseHeartbeat$ = interval(20000).pipe(
  map(() => ({ data: '', type: 'ping' }) as MessageEvent),
);
