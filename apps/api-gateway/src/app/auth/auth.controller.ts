import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoint,
  ApiVersion,
  EmptyResDTO,
  JWTTokensDTO,
  ResDTO,
} from '@libs/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserBodyDTO } from './dtos/create-user-body.dto';
import { SigninBodyDTO } from './dtos/signin-body.dto';

@ApiTags(ApiEndpoint.AUTH)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.AUTH}`)
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Post('signup')
  async signup(@Body() createUserPayload: CreateUserBodyDTO) {
    await firstValueFrom(
      this.userService.send<EmptyResDTO>('create_user', createUserPayload),
    );
  }

  @Post('signin')
  async signin(@Body() signinBodyDTO: SigninBodyDTO) {
    const tokens = await firstValueFrom(
      this.userService.send<JWTTokensDTO>('signin', {
        email: signinBodyDTO.email,
        password: signinBodyDTO.password,
      }),
    );

    return new ResDTO(tokens);
  }
}
