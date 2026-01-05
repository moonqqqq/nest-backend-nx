import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLlmSessionPayload {
  @ApiProperty({ example: 's59dsgkl2-sdfgdsf92sd-dsfgsdfg-sdfgds' })
  @IsString()
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
