import { Test, TestingModule } from '@nestjs/testing';
import { LlmSessionController } from './llm-session.controller';
import { LlmSessionService } from './llm-session.service';

describe('LlmSessionController', () => {
  let controller: LlmSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LlmSessionController],
      providers: [LlmSessionService],
    }).compile();

    controller = module.get<LlmSessionController>(LlmSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
