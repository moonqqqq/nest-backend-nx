import { Controller, Get, Query } from '@nestjs/common';
import { LlmServerService } from './llm-server.service';

@Controller('mock-llm-server')
export class LlmServerController {
  constructor(private readonly llmServerService: LlmServerService) {}

  @Get('answer')
  async answer(@Query('question') question: string) {
    const llmAnswerStream$ =
      this.llmServerService.createMockLlmAnswerStream(question);
    return llmAnswerStream$;
  }
}
