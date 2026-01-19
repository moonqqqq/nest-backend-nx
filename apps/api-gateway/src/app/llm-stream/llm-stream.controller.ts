import {
  Controller,
  Get,
  Param,
  Sse,
  UseGuards,
  MessageEvent,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoint,
  ApiVersion,
  AppEvent,
  JWTAuthGuard,
  sseHeartbeat$,
} from '@libs/shared';
import {
  LlmStreamService,
  LlmStreamMessageType,
  LlmStreamMessage,
} from '@libs/research-llm';
import { Observable, Subject, merge, takeWhile, finalize } from 'rxjs';

@ApiTags(ApiEndpoint.LLM_STREAMS)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.LLM_STREAMS}`)
export class LlmStreamController {
  constructor(private readonly llmStreamService: LlmStreamService) {}

  @Get(':messageId')
  @Sse()
  @UseGuards(JWTAuthGuard)
  async streamLlmMessage(
    @Param('messageId') messageId: string,
  ): Promise<Observable<MessageEvent>> {
    const subject = new Subject<MessageEvent>();
    let isComplete = false;

    const unsubscribe = await this.llmStreamService.subscribe(
      messageId,
      (message: LlmStreamMessage) => {
        switch (message.type) {
          case LlmStreamMessageType.CHUNK:
            subject.next(
              new AppEvent({
                type: 'stream_message',
                data: { content: message.content },
              }),
            );
            break;

          case LlmStreamMessageType.DONE:
            subject.next(
              new AppEvent({
                type: 'stream_completed',
                data: { messageId },
              }),
            );
            isComplete = true;
            subject.complete();
            break;

          case LlmStreamMessageType.ERROR:
            subject.next(
              new AppEvent({
                type: 'stream_failed',
                data: { error: message.error },
              }),
            );
            isComplete = true;
            subject.complete();
            break;
        }
      },
    );

    return merge(
      subject.asObservable(),
      sseHeartbeat$.pipe(takeWhile(() => !isComplete)),
    ).pipe(
      finalize(async () => {
        await unsubscribe();
      }),
    );
  }
}
