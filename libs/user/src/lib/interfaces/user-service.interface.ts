import { JWTTokensDTO } from '@libs/shared';
import { CreateUserPayload } from '../payloads/create-user.payload';
import { SigninPayload } from '../payloads/login.payload';

export abstract class IUserService {
  abstract createUser(createUserPayload: CreateUserPayload): Promise<void>;
  abstract login(loginPayload: SigninPayload): Promise<JWTTokensDTO>;
}
