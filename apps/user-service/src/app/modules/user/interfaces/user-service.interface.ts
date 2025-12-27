import { CreateUserPayload, UserProfile } from "@libs/user";

export abstract class IUserService {
    abstract createUser(createUserPayload: CreateUserPayload): Promise<UserProfile>;
}
