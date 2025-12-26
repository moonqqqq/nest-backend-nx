import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
