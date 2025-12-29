import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserBodyDTO {
  @ApiProperty({ example: 'hi@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'heal kim' })
  @IsString()
  name: string;
}
