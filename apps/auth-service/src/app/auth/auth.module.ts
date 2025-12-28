import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ServiceConfig } from '@libs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IAuthService } from './interfaces/auth-service.interface';
import { JWTModule } from '@libs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@libs/logger';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: (config: ConfigType<typeof ServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            port: parseInt(config.user.tcpPort),
          },
        }),
        inject: [ServiceConfig.KEY],
      },
    ]),
    JWTModule, HttpModule, LoggerModule],
  controllers: [AuthController],
  providers: [{
    provide: IAuthService,
    useClass: AuthService,
  }],
})
export class AuthModule { }
