import { Injectable } from '@nestjs/common';
import { IUserService } from '../interfaces/user-service.interface';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { CreateUserPayload } from '../payloads/create-user.payload';
import { SigninPayload } from '../payloads/login.payload';
import {
  InvalidPassword,
  JWTTokensDTO,
  UserAlreadyExists,
  UserNotFoundException,
} from '@libs/shared';
import { JWTService } from '@libs/shared';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService,
  ) {}

  async createUser(createUserPayload: CreateUserPayload): Promise<void> {
    const isDuplicate = await this.userRepository.checkEmailIsDuplicate(
      createUserPayload.email,
    );
    if (isDuplicate) {
      const exception = new UserAlreadyExists({
        email: createUserPayload.email,
      });
      throw exception;
    }

    await this.userRepository.create(createUserPayload);
  }

  async login(loginPayload: SigninPayload): Promise<JWTTokensDTO> {
    const user = await this.userRepository.findByEmail(loginPayload.email);
    if (!user || !user.id) {
      const exception = new UserNotFoundException();
      throw exception;
    }

    if (user.password !== loginPayload.password) {
      const exception = new InvalidPassword();
      throw exception;
    }

    return this.jwtService.createJWT({
      id: user.id,
    });
  }
}
