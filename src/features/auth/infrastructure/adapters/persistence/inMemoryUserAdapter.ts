import { User } from '../../../domain/entities/User.js';
import { UserRepositoryPort } from '../../../domain/ports/UserRepositoryPort.js';
import { PasswordHasherPort } from '../../../domain/ports/PasswordHasherPort.js';

/**
 * Adaptador en memoria con usuarios de desarrollo.
 * Sustituible por Prisma/PostgreSQL sin cambiar el dominio.
 */
export class InMemoryUserAdapter extends UserRepositoryPort {
  private users: User[];

  constructor(users: User[] = []) {
    super();
    this.users = users;
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    const normalized = identifier.toLowerCase();
    const found = this.users.find(
      (user) =>
          user.username.toLowerCase() === normalized ||
          user.email.toLowerCase() === normalized,
    );
    return found ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const normalized = username.toLowerCase();
    const found = this.users.find(
      (user) => user.username.toLowerCase() === normalized,
    );
    return found ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const found = this.users.find((user) => user.id === id);
    return found ?? null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async update(user: User): Promise<User> {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      this.users[idx] = user;
    }
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const originalLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < originalLength;
  }
}

/**
 * Crea el repositorio con usuarios seed y contraseñas hasheadas.
 * Contraseña por defecto en desarrollo: luxes2026
 */
export async function createInMemoryUserRepository(passwordHasher: PasswordHasherPort): Promise<InMemoryUserAdapter> {
  const defaultPasswordHash = await passwordHasher.hash('luxes2026');

  const seedData = [
    {
      id: 'USR-001',
      nombre: 'Admin Principal',
      email: 'admin@luxes.com',
      username: 'admin',
      rol: 'admin',
      estado: 'activo',
      fechaCreacion: '2025-01-15',
    },
    {
      id: 'USR-002',
      nombre: 'María Fernanda Torres',
      email: 'maria.torres@luxes.com',
      username: 'maria.torres',
      rol: 'editor',
      estado: 'activo',
      fechaCreacion: '2025-02-20',
    },
    {
      id: 'USR-003',
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@luxes.com',
      username: 'carlos.mendoza',
      rol: 'visor',
      estado: 'activo',
      fechaCreacion: '2025-03-10',
    },
  ];

  const users = seedData.map(
    (data) =>
      new User({
        ...data,
        passwordHash: defaultPasswordHash,
      }),
  );

  return new InMemoryUserAdapter(users);
}
