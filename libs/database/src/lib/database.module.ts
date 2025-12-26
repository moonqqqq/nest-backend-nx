// 학습용이므로 단일 디비를 여러 마이크로서비스에서 이용. 실무에선 마이크로서비스마다 분리.

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
