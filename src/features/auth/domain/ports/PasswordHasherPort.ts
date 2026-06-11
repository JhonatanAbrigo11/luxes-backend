/**
 * Puerto para verificación y hash de contraseñas.
 */
export abstract class PasswordHasherPort {
  abstract compare(plainPassword: string, passwordHash: string): Promise<boolean>;
  abstract hash(plainPassword: string): Promise<string>;
}

