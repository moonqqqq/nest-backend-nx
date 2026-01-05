import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JWTTokensDTO } from '../dtos/jwt-token.dto';
import { IUserPayload } from '../types/user-payload.interface';
import { AppConfig } from '@libs/config';

@Injectable()
export class JWTService {
  constructor(
    @Inject(AppConfig.KEY)
    private appConfig: ConfigType<typeof AppConfig>,
  ) {}

  async createJWT(userData: IUserPayload): Promise<JWTTokensDTO> {
    const payload = userData;

    const [accessToken, refreshToken] = await Promise.all([
      this.#signToken(
        payload,
        this.appConfig.jwtSecret,
        this.appConfig.jwtAccessExpire,
      ),
      this.#signToken(
        payload,
        this.appConfig.jwtSecret,
        this.appConfig.jwtRefreshExpire,
      ),
    ]);

    return new JWTTokensDTO({
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    });
  }

  async #signToken(
    payload: Partial<IUserPayload>,
    secretKey: string,
    expiresIn: string | number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        expiresIn: expiresIn,
      } as jwt.SignOptions;

      jwt.sign(payload, secretKey, options, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      });
    });
  }

  async verifyToken(token: string): Promise<IUserPayload> {
    return new Promise((resolve, reject) => {
      if (token.split(' ')[0] !== 'Bearer') {
        throw new BadRequestException({ message: 'Not proper token' });
      }

      jwt.verify(
        token.split(' ')[1],
        this.appConfig.jwtSecret,
        (err, decoded) => {
          if (err) {
            if (err.message === 'jwt expired') {
              reject(new UnauthorizedException('JWT expired'));
            } else if (err.message === 'invalid signature') {
              reject(
                new UnauthorizedException({ message: 'Invalid signature' }),
              );
            } else if (err.message === 'jwt malformed') {
              reject(new UnauthorizedException('JWT malformed'));
            } else {
              reject(err);
            }
          } else {
            resolve(decoded as IUserPayload);
          }
        },
      );
    });
  }
}
