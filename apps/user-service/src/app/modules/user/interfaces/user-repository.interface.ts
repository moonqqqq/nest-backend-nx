import { CreateUserPayload } from "@libs/user";

export abstract class IUserRepository {
    abstract checkEmailIsDuplicate(email: string): Promise<boolean>;
    abstract create(createUserPayload: CreateUserPayload): Promise<void>;

}
