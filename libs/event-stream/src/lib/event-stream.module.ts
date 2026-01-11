import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventStreamConsumerService } from './event-stream-consumer.service';
import { EventStreamProducerService } from './event-stream-producer.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [],
  providers: [EventStreamConsumerService, EventStreamProducerService],
  exports: [],
})
export class EventStreamModule {}
