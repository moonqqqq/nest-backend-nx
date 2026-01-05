import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from '../jwt/jwt.service';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JWTService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new UnauthorizedException({ message: 'Token required' });
    }
    req.user = await this.jwtService.verifyToken(req.headers.authorization);
    return true;
  }
}
