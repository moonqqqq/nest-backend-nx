import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { IUserRepository } from './interfaces/user-repository.interface';
import { UserRepository } from './user.repository';
import { IUserService } from './interfaces/user-service.interface';
import { DatabaseModule } from '@libs/database';
import { JWTModule } from '@libs/jwt';

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
