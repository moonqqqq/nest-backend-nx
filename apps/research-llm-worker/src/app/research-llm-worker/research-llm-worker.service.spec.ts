import { Test, TestingModule } from '@nestjs/testing';
import { ResearchLlmWorkerService } from './research-llm-worker.service';

describe('ResearchLlmWorkerService', () => {
  let service: ResearchLlmWorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResearchLlmWorkerService],
    }).compile();

    service = module.get<ResearchLlmWorkerService>(ResearchLlmWorkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
