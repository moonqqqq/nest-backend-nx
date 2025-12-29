import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/auth-service.interface';
import { JWTService } from '@libs/jwt';
import { CreateUserPayload, UserProfile } from '@libs/user';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceConfig } from '@libs/config';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(ServiceConfig.KEY)
    private serviceConfig: ConfigType<typeof ServiceConfig>,
    private readonly jwtService: JWTService,
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  async signup(createUserPayload: CreateUserPayload) {
    try {
      await firstValueFrom(
        this.userService.send<UserProfile>('create_user', createUserPayload),
      );
    } catch (e) {
      if (e.message.includes('Email is duplicate')) {
        throw new ConflictException('Email is duplicate');
      }
      throw e;
    }
  }
}
