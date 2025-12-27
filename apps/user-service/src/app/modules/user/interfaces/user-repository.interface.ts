import { CreateUserPayload, UserProfile } from "@libs/user";

export abstract class IUserRepository {
    abstract create(createUserPayload: CreateUserPayload): Promise<UserProfile>;

}
