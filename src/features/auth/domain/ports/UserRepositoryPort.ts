import { User } from '../entities/User.js';

/**
 * Puerto de persistencia de usuarios.
 * La infraestructura debe implementar estos métodos.
 */
export abstract class UserRepositoryPort {
  abstract findByUsernameOrEmail(identifier: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
}
