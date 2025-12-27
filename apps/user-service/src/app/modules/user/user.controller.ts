import {
  Controller
} from '@nestjs/common';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';
import { IUserService } from './interfaces/user-service.interface';

@ApiTags(ApiEndpoint.USERS)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.USERS}`)
export class UserController {
  constructor(private readonly userService: IUserService) { }

}
