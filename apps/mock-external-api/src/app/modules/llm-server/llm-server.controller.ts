import { Controller, Query, Sse } from '@nestjs/common';
import { from } from 'rxjs';
import { LlmServerService } from './llm-server.service';

@Controller('mock-llm-server')
export class LlmServerController {
  constructor(private readonly llmServerService: LlmServerService) {}

  @Sse('ask')
  answer(@Query('question') question: string) {
    const llmAnswerStream$ =
      this.llmServerService.createMockLlmAnswerStream(question);

    return from(llmAnswerStream$);
  }
}
