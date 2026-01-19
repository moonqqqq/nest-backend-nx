import { Module } from '@nestjs/common';
import { LlmStreamService } from '@libs/research-llm';
import { LlmStreamController } from './llm-stream.controller';

@Module({
  controllers: [LlmStreamController],
  providers: [LlmStreamService],
})
export class LlmStreamModule {}
