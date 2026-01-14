import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsumersModule } from './consumers/consumers.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, EventStreamConfig, ServiceConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig, EventStreamConfig],
    }),
    ConsumersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
