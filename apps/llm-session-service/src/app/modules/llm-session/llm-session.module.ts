import { Module } from '@nestjs/common';
import { LlmSessionService } from './llm-session.service';
import { LlmSessionController } from './llm-session.controller';
import { ILlmSessionService } from './interfaces/llm-session-service.interface';
import { LlmSessionRepository } from './llm-session.repository';
import { ILlmSessionRepository } from './interfaces/llm-session-repository.interface';
import { DatabaseModule } from '@libs/database';

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
