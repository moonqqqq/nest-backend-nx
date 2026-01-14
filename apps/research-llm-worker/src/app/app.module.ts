import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsumersModule } from './consumers/consumers.module';
import { ProcessorsModule } from './processors/processors.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, EventStreamConfig, ServiceConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig, EventStreamConfig],
    }),
    ConsumersModule,
    ProcessorsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
