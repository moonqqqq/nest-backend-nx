import { Controller } from '@nestjs/common';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ILlmSessionService } from './interfaces/llm-session-service.interface';
import {
  CreateLlmSessionPayload,
  GetLlmSessionsPayload,
} from '@libs/llm-session';

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

  @MessagePattern('get_llm_sessions')
  async getLlmSessions(@Payload() { userId }: GetLlmSessionsPayload) {
    return await this.llmSessionService.getLlmSessions(userId);
  }
}
