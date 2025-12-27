import { Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user-service.interface';
import { IUserRepository } from './interfaces/user-repository.interface';
import { CreateUserPayload, UserProfile } from '@libs/user';

@Injectable()
export class UserService implements IUserService {
    constructor(private readonly userRepository: IUserRepository) { }

    async createUser(createUserPayload: CreateUserPayload): Promise<UserProfile> {
        return this.userRepository.create(createUserPayload);
    }
}
