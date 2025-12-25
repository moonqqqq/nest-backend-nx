import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IdParamDTO {
  @ApiProperty({ example: '102' })
  @IsString()
  id!: string;
}
