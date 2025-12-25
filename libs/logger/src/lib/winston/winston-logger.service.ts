import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { ILoggerService } from '../interface/logger-service.interface';

@Injectable()
export class WinstonLoggerService implements ILoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
  ) { }

  info(data: string | object): void {
    this.logger.info(data);
  }

  error(err: string | object): void {
    this.logger.error(err);
  }

  warn(err: string | object): void {
    this.logger.warn(err);
  }
}
