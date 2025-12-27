import {
  Controller
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(ApiEndpoint.USERS)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.USERS}`)
export class UserController {
  constructor(private readonly userService: UserService) { }

}
