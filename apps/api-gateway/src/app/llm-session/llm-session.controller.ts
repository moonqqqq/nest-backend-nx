import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoint,
  ApiVersion,
  IUserPayload,
  ReqUser,
  ResDTO,
} from '@libs/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JWTAuthGuard } from '@libs/shared';
import { LlmSession } from '@libs/research-llm';

@ApiTags(ApiEndpoint.LLM_SESSIONS)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.LLM_SESSIONS}`)
export class LlmSessionController {
  constructor(
    @Inject('RESEARCH_LLM_SERVICE')
    private readonly researchLlmService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async createLlmSession(@ReqUser() currentUser: IUserPayload) {
    const userId = currentUser.id;
    const createdLlmSession = await firstValueFrom(
      this.researchLlmService.send<LlmSession>('create_llm_session', {
        userId,
      }),
    );
    return new ResDTO(createdLlmSession);
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  async getLlmSessions(@ReqUser() currentUser: IUserPayload) {
    const userId = currentUser.id;
    const llmSessions = await firstValueFrom(
      this.researchLlmService.send<LlmSession[]>('get_llm_sessions', {
        userId,
      }),
    );
    return new ResDTO(llmSessions);
  }
}
