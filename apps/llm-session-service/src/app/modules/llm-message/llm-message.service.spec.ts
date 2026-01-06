import { Test, TestingModule } from '@nestjs/testing';
import { LlmMessageService } from './llm-message.service';

describe('LlmMessageService', () => {
  let service: LlmMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmMessageService],
    }).compile();

    service = module.get<LlmMessageService>(LlmMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
