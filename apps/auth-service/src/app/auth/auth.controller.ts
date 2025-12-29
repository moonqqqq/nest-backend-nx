import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoint, ApiVersion } from '@libs/shared';
import { IAuthService } from './interfaces/auth-service.interface';
import { CreateUserBodyDTO } from './dtos/create-user-body.dto';

@ApiTags(ApiEndpoint.AUTH)
@Controller(`${ApiVersion.ONE}/${ApiEndpoint.AUTH}`)
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @Post('signup')
  async signup(@Body() createUserBodyDTO: CreateUserBodyDTO) {
    return this.authService.signup(createUserBodyDTO);
  }
}
