import { Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
