import { Controller } from '@nestjs/common';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';
import { ILlmMessageService } from './interfaces/llm-message-service.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateLlmMessagePayload } from '@libs/llm-session';

@ApiTags(ApiEndpoint.LLM_MESSAGES)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.LLM_MESSAGES}`)
export class LlmMessageController {
  constructor(private readonly llmMessageService: ILlmMessageService) {}

  @MessagePattern('create_llm_message')
  async createLlmMessage(
    @Payload() { userId, llmSessionId, content }: CreateLlmMessagePayload,
  ) {
    return await this.llmMessageService.create(userId, llmSessionId, content);
  }
}
