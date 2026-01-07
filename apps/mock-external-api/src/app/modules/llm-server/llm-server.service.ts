import { Injectable, MessageEvent } from '@nestjs/common';
import { AppEventType } from '@libs/shared';

@Injectable()
export class LlmServerService {
  async *createMockLlmAnswerStream(
    content: string,
  ): AsyncIterable<MessageEvent> {
    // 5초 지연
    await this.delay(5000);

    // 시작 이벤트
    yield {
      type: AppEventType.STREAM_STARTED,
      data: { message: '스트림 시작' },
    };

    // 내부 사고 과정 시뮬레이션
    yield {
      type: AppEventType.STREAM_INTERNAL_THINKING,
      data: { message: '사용자 질문을 분석하고 있습니다...' },
    };

    await this.delay(1000);

    yield {
      type: AppEventType.STREAM_INTERNAL_THINKING,
      data: { message: '관련 정보를 검색하고 있습니다...' },
    };

    await this.delay(5000);

    // 메시지 청크들 (실제 LLM 응답 시뮬레이션)
    const mockResponse = `안녕하세요! "${content}"에 대한 질문을 받았습니다. 대답은 ~ 입니다.`;

    // 문자열을 일정 길이로 잘라 스트리밍 (한 글자씩 대신)
    const chunkSize = 12;
    for (let i = 0; i < mockResponse.length; i += chunkSize) {
      const chunk = mockResponse.slice(i, i + chunkSize);
      yield { type: AppEventType.STREAM_MESSAGE, data: { message: chunk } };
      await this.delay(80); // 80ms 지연으로 타이핑 효과
    }

    await this.delay(500);

    // 완료 이벤트
    yield {
      type: AppEventType.STREAM_COMPLETED,
      data: { message: '스트림 완료' },
    };
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
