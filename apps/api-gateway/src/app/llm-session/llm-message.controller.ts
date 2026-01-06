import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
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
import { LlmMessage } from '@libs/llm-session';
import { CreateLlmMessageBodyDTO } from './dtos/create-llm-message-body.dto';

@ApiTags(ApiEndpoint.LLM_MESSAGES)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.LLM_MESSAGES}`)
export class LlmMessageController {
  constructor(
    @Inject('LLM_SESSION_SERVICE')
    private readonly llmSessionService: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async createLlmMessage(
    @ReqUser() currentUser: IUserPayload,
    @Body() { llmSessionId, content }: CreateLlmMessageBodyDTO,
  ) {
    const userId = currentUser.id;

    const createdLlmMessage = await firstValueFrom(
      this.llmSessionService.send<LlmMessage>('create_llm_message', {
        userId,
        llmSessionId,
        content,
      }),
    );
    return new ResDTO(createdLlmMessage);
  }
}
