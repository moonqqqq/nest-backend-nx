import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLlmMessagePayload {
  @ApiProperty({ example: 's59dsgkl2-sdfgdsf92sd-dsfgsdfg-sdfgds' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 's59dsgkl2-sdfgdsf92sd-dsfgsdfg-sdfgds' })
  @IsString()
  llmSessionId: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  content: string;

  constructor(userId: string, llmSessionId: string, content: string) {
    this.userId = userId;
    this.llmSessionId = llmSessionId;
    this.content = content;
  }
}
