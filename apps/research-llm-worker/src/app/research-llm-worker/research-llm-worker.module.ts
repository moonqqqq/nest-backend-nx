import { Module } from '@nestjs/common';
import { ResearchLlmWorkerService } from './research-llm-worker.service';

@Module({
  providers: [ResearchLlmWorkerService],
})
export class ResearchLlmWorkerModule {}
