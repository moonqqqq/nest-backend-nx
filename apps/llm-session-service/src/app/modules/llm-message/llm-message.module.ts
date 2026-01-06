import { Module } from '@nestjs/common';
import { LlmMessageService } from './llm-message.service';
import { LlmMessageController } from './llm-message.controller';
import { ILlmMessageService } from './interfaces/llm-message-service.interface';
import { ILlmMessageRepository } from './interfaces/llm-message-repository.interface';
import { LlmMessageRepository } from './llm-message.repository';
import { DatabaseModule } from '@libs/database';
import { LlmSessionModule } from '../llm-session/llm-session.module';

@Module({
  imports: [DatabaseModule, LlmSessionModule],
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
