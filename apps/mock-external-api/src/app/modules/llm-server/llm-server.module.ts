import { Module } from '@nestjs/common';
import { LlmServerService } from './llm-server.service';
import { LlmServerController } from './llm-server.controller';

@Module({
  controllers: [LlmServerController],
  providers: [LlmServerService],
})
export class LlmServerModule {}
