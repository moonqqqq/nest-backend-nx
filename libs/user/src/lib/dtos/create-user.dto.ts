export class CreateUserPayload {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly name: string,
  ) {}
}
