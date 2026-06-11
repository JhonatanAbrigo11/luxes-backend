/**
 * Value object: credenciales de ingreso.
 */
export class Credentials {
  readonly username: string;
  readonly password: string;

  constructor(username?: string, password?: string) {
    this.username = username?.trim() ?? '';
    this.password = password ?? '';
  }

  isValid(): boolean {
    return this.username.length > 0 && this.password.length > 0;
  }
}

