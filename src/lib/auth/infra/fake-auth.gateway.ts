import { AuthGateway } from "../model/auth.gateway"

export class FakeAuthGateway implements AuthGateway {
  authUser!: string

  public getAuthUser(): string {
    return this.authUser
  }
}

export const authGateway = new FakeAuthGateway()
