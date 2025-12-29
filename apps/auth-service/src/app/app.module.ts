import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JWTModule } from '@libs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, ServiceConfig } from '@libs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, ServiceConfig],
    }),
    AuthModule,
    JWTModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
