import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/auth-service.interface';
import { JWTService } from '@libs/jwt';
import { CreateUserPayload } from '@libs/user';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceConfig } from '@libs/config';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { EmptyResDTO } from '@libs/shared';

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
    await firstValueFrom(
      this.userService.send<EmptyResDTO>('create_user', createUserPayload),
    );
  }
}
