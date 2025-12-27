import { Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/database';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
