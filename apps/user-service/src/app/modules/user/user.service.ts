import { Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user-service.interface';
import { IUserRepository } from './interfaces/user-repository.interface';
import { CreateUserPayload } from '@libs/user';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService implements IUserService {
    constructor(private readonly userRepository: IUserRepository) { }

    async createUser(createUserPayload: CreateUserPayload): Promise<void> {
        const isDuplicate = await this.userRepository.checkEmailIsDuplicate(createUserPayload.email);
        if (isDuplicate) throw new RpcException({ message: 'Email is duplicate', code: 409 });


        await this.userRepository.create(createUserPayload);
    }
}
