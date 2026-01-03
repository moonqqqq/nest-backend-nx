import { JWTTokensDTO } from '@libs/shared';
import { CreateUserPayload, SigninPayload } from '@libs/user';

export abstract class IUserService {
  abstract createUser(createUserPayload: CreateUserPayload): Promise<void>;
  abstract login(loginPayload: SigninPayload): Promise<JWTTokensDTO>;
}
