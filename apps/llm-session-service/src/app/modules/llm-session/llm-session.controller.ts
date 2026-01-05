import { Controller } from '@nestjs/common';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateLlmSessionPayload } from '@libs/llm-session';
import { ILlmSessionService } from './interfaces/llm-session-service.interface';

@ApiTags(ApiEndpoint.LLM_SESSION)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.LLM_SESSION}`)
export class LlmSessionController {
  constructor(private readonly llmSessionService: ILlmSessionService) {}

  @MessagePattern('create_llm_session')
  async createLlmSession(
    @Payload() createLlmSessionPayload: CreateLlmSessionPayload,
  ) {
    return await this.llmSessionService.create(createLlmSessionPayload.userId);
  }
}
