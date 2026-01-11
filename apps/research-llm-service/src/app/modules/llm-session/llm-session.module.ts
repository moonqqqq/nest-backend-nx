import { Module } from '@nestjs/common';
import { LlmSessionController } from './llm-session.controller';
import { DatabaseModule } from '@libs/database';
import {
  ILlmSessionService,
  LlmSessionService,
  LlmSessionRepository,
  ILlmSessionRepository,
} from '@libs/research-llm';

@Module({
  imports: [DatabaseModule],
  controllers: [LlmSessionController],
  providers: [
    {
      provide: ILlmSessionService,
      useClass: LlmSessionService,
    },
    {
      provide: ILlmSessionRepository,
      useClass: LlmSessionRepository,
    },
  ],
  exports: [
    {
      provide: ILlmSessionService,
      useClass: LlmSessionService,
    },
  ],
})
export class LlmSessionModule {}
