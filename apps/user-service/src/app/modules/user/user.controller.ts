import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserPayload, IUserService, SigninPayload } from '@libs/user';

@ApiTags(ApiEndpoint.USERS)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.USERS}`)
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @MessagePattern('create_user')
  async createUser(@Payload() createUserPayload: CreateUserPayload) {
    await this.userService.createUser(createUserPayload);
    return null;
  }

  @MessagePattern('signin')
  async login(@Payload() loginPayload: SigninPayload) {
    const tokens = await this.userService.login(loginPayload);
    return tokens;
  }
}
