import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseDomain {
  @ApiProperty({ example: '123' })
  readonly id?: string;

  constructor(id?: string) {
    this.id = id;
  }

  getId(): string | undefined {
    return this.id;
  }
}
