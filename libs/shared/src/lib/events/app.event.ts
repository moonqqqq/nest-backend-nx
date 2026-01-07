import { TAppEventType } from '../types/app-event.typs';
import { MessageEvent } from '@nestjs/common';

/**
 * 앱 내부에서 이용하는 이벤트 객체
 * 모든 이벤트는 이 클래스로 변환되서 로직에서 이용되어야한다.
 * 아웃풋으로 넘길때 필요한 이벤트 객체로 변환하여 반환해야한다.
 */
export class AppEvent implements MessageEvent {
  readonly id?: string;
  readonly data: string | object;
  readonly type: string;
  readonly retry?: number;

  constructor({
    id,
    type,
    data,
    retry,
  }: {
    id?: string;
    type: TAppEventType;
    data: string | object;
    retry?: number;
  }) {
    this.id = id;
    this.type = type;
    this.data = data as string | object;
    this.retry = retry;
  }
}
