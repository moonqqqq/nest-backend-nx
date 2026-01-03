import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class BaseResDTO<T> {
  @ApiProperty()
  @IsBoolean()
  readonly success: boolean;

  @ApiProperty()
  readonly data: T;

  constructor(success: boolean, data: T) {
    this.success = success;
    this.data = data;
  }
}
