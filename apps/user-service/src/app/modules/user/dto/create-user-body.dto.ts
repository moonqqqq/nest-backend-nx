import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserBodyDTO {
  @ApiProperty({
    example: 'loginid123@gmail.com',
    description: 'email',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'password',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: 'name',
    description: 'name',
  })
  @IsString()
  readonly name: string;
}
