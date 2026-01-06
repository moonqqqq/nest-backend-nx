import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetLlmMessagesPayload {
  @ApiProperty({ example: 's59dsgkl2-sdfgdsf92sd-dsfgsdfg-sdfgds' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 's59dsgkl2-sdfgdsf92sd-dsfgsdfg-sdfgds' })
  @IsString()
  llmSessionId: string;

  constructor(userId: string, llmSessionId: string) {
    this.userId = userId;
    this.llmSessionId = llmSessionId;
  }
}
