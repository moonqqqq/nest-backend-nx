import { Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TaskQueueConstants } from '@libs/task-queue';
import { ILoggerService } from '@libs/logger';
import { AppEvent } from '@libs/shared';

@Injectable()
@Processor(TaskQueueConstants.CREATE_LLM_ANSWER, { concurrency: 20 })
export class LlmAnswerProcessor extends WorkerHost {
  constructor(private readonly logger: ILoggerService) {
    super();
  }

  async process(job: Job<AppEvent>): Promise<void> {
    this.logger.info(`Processing LLM answer job: ${job.id}`);

    const { id, type, data } = job.data;

    try {
      // TODO: LLM 응답 생성 로직 구현
      this.logger.info(`Job ${job.id} - Event type: ${type}, Event ID: ${id}`);
      this.logger.info(`Job ${job.id} - Data: ${JSON.stringify(data)}`);

      // TODO: 실제 LLM 처리 로직 추가
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}: ${error}`);
      throw error;
    }
  }
}
