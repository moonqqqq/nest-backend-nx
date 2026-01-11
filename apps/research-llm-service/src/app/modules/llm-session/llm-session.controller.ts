import { Controller } from '@nestjs/common';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateLlmSessionPayload,
  GetLlmSessionsPayload,
  ILlmSessionService,
} from '@libs/research-llm';

@ApiTags(ApiEndpoint.LLM_SESSIONS)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.LLM_SESSIONS}`)
export class LlmSessionController {
  constructor(private readonly llmSessionService: ILlmSessionService) {}

  @MessagePattern('create_llm_session')
  async createLlmSession(
    @Payload() createLlmSessionPayload: CreateLlmSessionPayload,
  ) {
    return await this.llmSessionService.create(createLlmSessionPayload.userId);
  }

  @MessagePattern('get_llm_sessions')
  async getLlmSessions(@Payload() { userId }: GetLlmSessionsPayload) {
    return await this.llmSessionService.getLlmSessions(userId);
  }
}
