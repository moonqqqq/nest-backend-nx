import { Controller, Inject, Post, UseGuards } from '@nestjs/common';
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
import { LlmSession } from '@libs/llm-session';

@ApiTags(ApiEndpoint.LLM_SESSION)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.LLM_SESSION}`)
export class LlmSessionController {
  constructor(
    @Inject('LLM_SESSION_SERVICE')
    private readonly llmSessionService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async createLlmSession(@ReqUser() currentUser: IUserPayload) {
    const userId = currentUser.id;
    const createdLlmSession = await firstValueFrom(
      this.llmSessionService.send<LlmSession>('create_llm_session', { userId }),
    );
    return new ResDTO(createdLlmSession);
  }
}
