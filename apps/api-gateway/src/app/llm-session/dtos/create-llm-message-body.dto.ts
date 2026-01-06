import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLlmMessageBodyDTO {
  @ApiProperty({ example: 's59dsgkl2-sdfgdsf92sd-dsfgsdfg-sdfgds' })
  @IsString()
  llmSessionId: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  content: string;
}
