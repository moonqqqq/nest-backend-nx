import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
