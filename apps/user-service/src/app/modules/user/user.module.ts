import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import {
  IUserRepository,
  IUserService,
  UserRepository,
  UserService,
} from '@libs/user';
import { DatabaseModule } from '@libs/database';
import { JWTModule } from '@libs/shared';

@Module({
  imports: [DatabaseModule, JWTModule],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IUserService,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
