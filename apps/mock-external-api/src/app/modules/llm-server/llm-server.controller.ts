import { Controller, Query, Sse } from '@nestjs/common';
import { merge } from 'rxjs';
import { LlmServerService } from './llm-server.service';
import { sseHeartbeat$ } from '@libs/shared';

@Controller('mock-llm-server')
export class LlmServerController {
  constructor(private readonly llmServerService: LlmServerService) {}

  @Sse('ask')
  answer(@Query('question') question: string) {
    const llmAnswerStream$ =
      this.llmServerService.createMockLlmAnswerStream(question);

    return merge(llmAnswerStream$, sseHeartbeat$);
  }
}
