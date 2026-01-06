import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserPayload {
  @ApiProperty({ example: 'hi@gmail.com' })
  @IsString()
  readonly email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  readonly password: string;

  @ApiProperty({ example: 'heal kim' })
  @IsString()
  readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
