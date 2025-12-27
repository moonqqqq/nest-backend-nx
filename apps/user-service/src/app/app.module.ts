import { Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/database';
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';
import { IUserService } from './modules/user/interfaces/user-service.interface';
import { UserService } from './modules/user/user.service';
import { IUserRepository } from './modules/user/interfaces/user-repository.interface';
import { UserRepository } from './modules/user/user.repository';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, ServiceConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AppConfig,
        ServiceConfig
      ],
    }),
    DatabaseModule, UserModule],
  controllers: [UserController],
  providers: [{
    provide: IUserService,
    useClass: UserService,
  }, {
    provide: IUserRepository,
    useClass: UserRepository
  }],
})
export class AppModule { }
