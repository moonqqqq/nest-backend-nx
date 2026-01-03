import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { PrismaService } from '@libs/database';
import { CreateUserPayload, UserProfile } from '@libs/user';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkEmailIsDuplicate(email: string) {
    const userEntity = await this.prisma.userEntity.findUnique({
      where: {
        email,
      },
    });

    return !!userEntity;
  }

  async create(createUserPayload: CreateUserPayload) {
    await this.prisma.userEntity.create({
      data: {
        email: createUserPayload.email,
        name: createUserPayload.name,
        password: createUserPayload.password,
      },
    });
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const userEntity = await this.prisma.userEntity.findUnique({
      where: {
        email,
      },
    });

    if (!userEntity) return null;

    return UserProfile.fromEntity(userEntity);
  }
}
