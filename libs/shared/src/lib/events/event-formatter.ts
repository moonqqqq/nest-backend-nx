// SseFormatter.ts
import { AppEvent } from './app.event';
import { TAppEventType } from '../types/app-event.typs';

export class EventFormatter {
  // @Sse 데코레이터가 알아서 해줌.
  /**
   * 1. Output (내보내기): AppEvent 객체 -> SSE 문자열
   */
  // static toSseString(event: AppEvent): string {
  //   let outputString = '';

  //   // 메타데이터 처리
  //   if (event.id) outputString += `id: ${event.id}\n`;
  //   if (event.type) outputString += `event: ${event.type}\n`;
  //   outputString += `retry: 3000\n`; // 나중에 동적으로 설정하도록. 부하가 클때면 숫자 늘리고 부하가 적으면 숫자 작게.
  //   if (event.payload) {
  //     outputString += `data: ${JSON.stringify(event.payload)}\n\n`;
  //   }

  //   return outputString;
  // }

  /**
   * 2. Input (받아오기): 파싱된 SSE 데이터 -> AppEvent 객체
   * block은 SSE 라이브러리(eventsource-parser 등)가 1차로 쪼개준 객체라고 가정
   */
  static fromSSEString(block: string): AppEvent | null {
    let event;
    let data;
    let id;

    const lines = block.split('\n');
    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        data = JSON.parse(line.slice(5).trim());
      } else if (line.startsWith('id:')) {
        id = line.slice(3).trim();
      }
    }

    if (!event) return null;

    return new AppEvent({
      id: id,
      type: event as TAppEventType,
      data,
    });
  }
}
