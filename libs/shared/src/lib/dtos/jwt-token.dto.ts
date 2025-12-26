import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class JWTTokensDTO {
  @Expose()
  @ApiProperty({ example: 'Bearer awfhiosdjfiomeoiwe' })
  @IsNotEmpty()
  readonly accessToken: string;

  @Expose()
  @ApiProperty({ example: 'Bearer awfhiosdjfiomeoiwe' })
  @IsNotEmpty()
  readonly refreshToken: string;

  constructor(user: { accessToken: string; refreshToken: string }) {
    this.accessToken = user.accessToken;
    this.refreshToken = user.refreshToken;
  }
}
