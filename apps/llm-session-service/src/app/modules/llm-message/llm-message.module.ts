import { Module } from '@nestjs/common';
import { LlmMessageService } from './llm-message.service';
import { LlmMessageController } from './llm-message.controller';

@Module({
  controllers: [LlmMessageController],
  providers: [LlmMessageService],
})
export class LlmMessageModule {}
