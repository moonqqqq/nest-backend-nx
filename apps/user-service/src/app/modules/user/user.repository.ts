import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { PrismaService } from '@libs/database';
import { CreateUserPayload, UserProfile } from '@libs/user';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createUserPayload: CreateUserPayload) {
        const userEntity = await this.prisma.userEntity.create({
            data: {
                email: createUserPayload.email,
                name: createUserPayload.name,
                password: createUserPayload.password,
            }
        });

        return UserProfile.fromEntity(userEntity);
    }
}
