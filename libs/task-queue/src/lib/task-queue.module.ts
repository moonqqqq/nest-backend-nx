import { Module } from '@nestjs/common';
import { TaskQueueService } from './task-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskQueueConstants } from './constants/task-queue.constant';
import { LoggerModule } from '@libs/logger';
import { TaskQueueConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TaskQueueConfig],
    }),
    LoggerModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('taskQueue.redisHost'),
          port: configService.get('taskQueue.redisPort'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: TaskQueueConstants.CREATE_LLM_ANSWER,
    }),
  ],
  controllers: [],
  providers: [TaskQueueService],
  exports: [TaskQueueService],
})
export class TaskQueueModule {}
