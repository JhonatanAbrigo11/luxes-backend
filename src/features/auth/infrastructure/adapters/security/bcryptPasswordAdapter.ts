import bcrypt from 'bcryptjs';
import { PasswordHasherPort } from '../../../domain/ports/PasswordHasherPort.js';

const SALT_ROUNDS = 10;

/**
 * Adaptador de infraestructura: bcrypt para contraseñas.
 */
export class BcryptPasswordAdapter extends PasswordHasherPort {
  async compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  }
}

