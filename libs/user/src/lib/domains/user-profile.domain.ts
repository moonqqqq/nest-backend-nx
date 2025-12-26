import { BaseDomain } from '@libs/shared';

export class UserProfile extends BaseDomain {
  public readonly email: string;
  public readonly name: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(payload: {
    id?: string;
    email: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(payload.id);
    this.email = payload.email;
    this.name = payload.name;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }
}
