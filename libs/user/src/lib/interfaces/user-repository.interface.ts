import { CreateUserPayload } from '../payloads/create-user.payload';
import { UserProfile } from '../domains/user-profile.domain';

export abstract class IUserRepository {
  abstract checkEmailIsDuplicate(email: string): Promise<boolean>;
  abstract create(createUserPayload: CreateUserPayload): Promise<void>;
  abstract findByEmail(email: string): Promise<UserProfile | null>;
}
