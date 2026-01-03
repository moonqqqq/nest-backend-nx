import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiEndpoint, ApiVersion, EmptyResDTO } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';
import { IUserService } from './interfaces/user-service.interface';
import { CreateUserPayload } from '@libs/user';

@ApiTags(ApiEndpoint.USERS)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.USERS}`)
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @MessagePattern('create_user')
  async createUser(createUserPayload: CreateUserPayload) {
    await this.userService.createUser(createUserPayload);
    return new EmptyResDTO();
  }
}
