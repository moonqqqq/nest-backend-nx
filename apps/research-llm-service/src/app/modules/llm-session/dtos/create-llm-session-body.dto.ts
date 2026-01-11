import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLlmSessionBodyDTO {
  @ApiProperty({
    example: 's59dsgkl2-sdfgdsf92sd-dsfgsdfg-sdfgds',
    description: 'userId',
  })
  @IsString()
  readonly userId: string;
}
