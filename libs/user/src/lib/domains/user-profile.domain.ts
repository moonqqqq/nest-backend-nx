import { BaseDomain } from '@libs/shared';

export class UserProfile extends BaseDomain {
  public readonly email: string;
  public readonly name: string;
  public readonly password: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(payload: {
    id?: string;
    email: string;
    name: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(payload.id);
    this.email = payload.email;
    this.name = payload.name;
    this.password = payload.password;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  static fromEntity(data: {
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): UserProfile {
    return new UserProfile({
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
