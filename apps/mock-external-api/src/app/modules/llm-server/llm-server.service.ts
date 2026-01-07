import { Injectable } from '@nestjs/common';
import { AppEventType } from '@libs/shared';

@Injectable()
export class LlmServerService {
  async *createMockLlmAnswerStream(content: string): AsyncIterable<string> {
    // 시작 이벤트

    // 5초 지연
    await this.delay(5000);

    yield `event: ${AppEventType.STREAM_STARTED}\ndata: {"message": "스트림 시작"}\n\n`;

    // 내부 사고 과정 시뮬레이션
    yield `event: ${AppEventType.STREAM_INTERNAL_THINKING}\ndata: {"message": "사용자 질문을 분석하고 있습니다..."}\n\n`;

    await this.delay(1000);

    yield `event: ${AppEventType.STREAM_INTERNAL_THINKING}\ndata: {"message": "관련 정보를 검색하고 있습니다..."}\n\n`;

    await this.delay(5000);

    // 메시지 청크들 (실제 LLM 응답 시뮬레이션)
    const mockResponse = `안녕하세요! "${content}"에 대한 질문을 받았습니다. 대답은 ~ 입니다.`;

    const chunks = mockResponse.split('').map((char) => char);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks.slice(0, i + 1).join('');
      yield `event: ${AppEventType.STREAM_MESSAGE}\ndata: {"message": "${chunk}"}\n\n`;
      await this.delay(50); // 50ms 지연으로 타이핑 효과
    }

    await this.delay(500);

    // 완료 이벤트
    yield `event: ${AppEventType.STREAM_COMPLETED}\ndata: {"message": "스트림 완료"}\n\n`;
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
