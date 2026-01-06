import { Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/database';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, ServiceConfig } from '@libs/config';
import { LoggerModule } from '@libs/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig],
    }),
    DatabaseModule,
    UserModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
