import { Injectable } from '@nestjs/common';
import { CreateUserPayload } from '@libs/user';
import { PrismaService } from '@libs/database';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async createUser({ email, password }: CreateUserPayload): Promise<void> {
    // save user to database
    await this.prismaService.userEntity.create({
      data: {
        email,
        password,
      },
    });
  }
}
