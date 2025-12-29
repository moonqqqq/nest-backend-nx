import { CreateUserPayload } from '@libs/user';

export abstract class IUserService {
  abstract createUser(createUserPayload: CreateUserPayload): Promise<void>;
}
