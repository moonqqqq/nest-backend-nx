import { CreateUserPayload } from '@libs/user';

export abstract class IAuthService {
  abstract signup(createUserPayload: CreateUserPayload);
}
