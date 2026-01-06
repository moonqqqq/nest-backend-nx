/**
 * 앱 내부에서 이용하는 이벤트 객체
 * 모든 이벤트는 이 클래스로 변환되서 로직에서 이용되어야한다.
 * 아웃풋으로 넘길때 필요한 이벤트 객체로 변환하여 반환해야한다.
 */
export class AppEvent {
  readonly id?: string;
  readonly type: string;
  readonly payload: Record<string, unknown>;

  constructor(type: string, payload: Record<string, unknown>) {
    this.type = type;
    this.payload = payload;
  }
}
