import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppConfig, ServiceConfig } from '@libs/config';
import { LoggerModule } from '@libs/logger';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig],
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (config: ConfigType<typeof ServiceConfig>) => ({
          transport: Transport.TCP,
          options: {
            port: parseInt(config.auth.tcpPort),
          },
        }),
        inject: [ServiceConfig.KEY],
      },
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
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
