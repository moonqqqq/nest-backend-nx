import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmServerModule } from './modules/llm-server/llm-server.module';

@Module({
  imports: [LlmServerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
