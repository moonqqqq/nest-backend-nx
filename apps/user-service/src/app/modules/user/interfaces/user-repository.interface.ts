import { CreateUserPayload, UserProfile } from '@libs/user';

export abstract class IUserRepository {
  abstract checkEmailIsDuplicate(email: string): Promise<boolean>;
  abstract create(createUserPayload: CreateUserPayload): Promise<void>;
  abstract findByEmail(email: string): Promise<UserProfile | null>;
}
