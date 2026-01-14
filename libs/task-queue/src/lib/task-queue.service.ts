import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  TaskQueueConstants,
  TTaskQueueName,
} from './constants/task-queue.constant';
import { ILoggerService } from '@libs/logger';
import { AppEvent } from '@libs/shared';

@Injectable()
export class TaskQueueService {
  constructor(
    @InjectQueue(TaskQueueConstants.CREATE_LLM_ANSWER) private llmQueue: Queue,
    private readonly logger: ILoggerService,
  ) {}

  async enqueue(queueName: TTaskQueueName, data: AppEvent) {
    this.logger.info(`Enqueueing LLM request for user: ${queueName}`);

    // **재시도 정책 설정:**
    const jobOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential', // 지수 백오프
        delay: 3000, // 첫 재시도 대기 시간 (ms)
      },
      removeOnComplete: true,
      removeOnFail: false,
    };

    if (queueName === TaskQueueConstants.CREATE_LLM_ANSWER) {
      const job = await this.llmQueue.add('llm-stream-task', data, jobOptions);
      return { jobId: job.id, status: 'processing_queued' };
    }

    return { jobId: null, status: 'invalid_queue_name' };
  }
}
