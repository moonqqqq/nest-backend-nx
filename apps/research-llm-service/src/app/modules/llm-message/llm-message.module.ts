import { Module } from '@nestjs/common';
import { LlmMessageController } from './llm-message.controller';
import { DatabaseModule } from '@libs/database';
import { LlmSessionModule } from '../llm-session/llm-session.module';
import {
  ILlmMessageService,
  LlmMessageService,
  LlmMessageRepository,
  ILlmMessageRepository,
} from '@libs/research-llm';
import { EventStreamModule } from '@libs/event-stream';

@Module({
  imports: [DatabaseModule, LlmSessionModule, EventStreamModule],
  controllers: [LlmMessageController],
  providers: [
    {
      provide: ILlmMessageService,
      useClass: LlmMessageService,
    },
    {
      provide: ILlmMessageRepository,
      useClass: LlmMessageRepository,
    },
  ],
})
export class LlmMessageModule {}
