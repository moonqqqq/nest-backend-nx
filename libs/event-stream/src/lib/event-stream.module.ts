import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventStreamConsumerService } from './event-stream-consumer.service';
import { EventStreamProducerService } from './event-stream-producer.service';
import { AppConfig, EventStreamConfig, ServiceConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig, EventStreamConfig],
    }),
    LoggerModule,
  ],
  controllers: [],
  providers: [EventStreamConsumerService, EventStreamProducerService],
  exports: [EventStreamConsumerService, EventStreamProducerService],
})
export class EventStreamModule {}
