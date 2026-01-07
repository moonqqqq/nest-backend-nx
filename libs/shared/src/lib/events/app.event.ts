import { TAppEventType } from '../types/app-event.typs';

/**
 * 앱 내부에서 이용하는 이벤트 객체
 * 모든 이벤트는 이 클래스로 변환되서 로직에서 이용되어야한다.
 * 아웃풋으로 넘길때 필요한 이벤트 객체로 변환하여 반환해야한다.
 */
export class AppEvent {
  readonly id?: string;
  readonly type: TAppEventType;
  readonly payload: Record<string, unknown>;

  constructor(object: {
    id?: string;
    type: TAppEventType;
    payload: Record<string, unknown>;
  }) {
    this.id = object.id;
    this.type = object.type;
    this.payload = object.payload;
  }
}
