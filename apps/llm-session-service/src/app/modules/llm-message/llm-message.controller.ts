import { Controller } from '@nestjs/common';
import { LlmMessageService } from './llm-message.service';

@Controller('llm-message')
export class LlmMessageController {
  constructor(private readonly llmMessageService: LlmMessageService) {}
}
