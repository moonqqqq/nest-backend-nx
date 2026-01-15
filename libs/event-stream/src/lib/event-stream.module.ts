import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventStreamConsumerFactoryService } from './event-stream-consumer-factory.service';
import { EventStreamProducerFactoryService } from './event-stream-producer-factory.service';
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
  providers: [
    EventStreamConsumerFactoryService,
    EventStreamProducerFactoryService,
  ],
  exports: [
    EventStreamConsumerFactoryService,
    EventStreamProducerFactoryService,
  ],
})
export class EventStreamModule {}
