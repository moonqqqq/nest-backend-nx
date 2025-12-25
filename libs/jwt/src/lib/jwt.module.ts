import { Global, Module } from '@nestjs/common';
import { LoggerModule } from '@libs/logger';
import { JWTService } from './jwt.service';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [JWTService],
  exports: [JWTService],
})
export class JWTModule { }
