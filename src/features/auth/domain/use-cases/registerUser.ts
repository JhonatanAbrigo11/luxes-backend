import { User } from '../entities/User.js';
import { UserRepositoryPort } from '../ports/UserRepositoryPort.js';
import { PasswordHasherPort } from '../ports/PasswordHasherPort.js';
import { ValidationError, UserAlreadyExistsError } from '../errors/AuthErrors.js';

interface RegisterInput {
  nombre?: string;
  email?: string;
  username?: string;
  password?: string;
  rol?: string;
}

interface RegisterDependencies {
  userRepository: UserRepositoryPort;
  passwordHasher: PasswordHasherPort;
}

/**
 * Caso de uso: Registrar un nuevo usuario.
 * Aplica lógica de negocio de dominio para validar campos, contraseñas y unicidad.
 */
export async function registerUser(
  { nombre, email, username, password, rol }: RegisterInput,
  { userRepository, passwordHasher }: RegisterDependencies,
): Promise<User> {
  if (!nombre?.trim()) throw new ValidationError('El nombre es requerido');
  if (!email?.trim()) throw new ValidationError('El correo electrónico es requerido');
  if (!username?.trim()) throw new ValidationError('El nombre de usuario es requerido');
  if (!password || password.length < 6) {
    throw new ValidationError('La contraseña es requerida y debe tener al menos 6 caracteres');
  }

  const parsedRol = rol?.toLowerCase() || 'visor';
  if (!['admin', 'editor', 'visor', 'administrador', 'servicio al cliente', 'user'].includes(parsedRol)) {
    throw new ValidationError('El rol ingresado no es válido');
  }

  // Verificar si ya existe por email o username
  const existingUser = await userRepository.findByUsernameOrEmail(email);
  if (existingUser) {
    throw new UserAlreadyExistsError('El correo electrónico ya está registrado');
  }

  const existingUsername = await userRepository.findByUsernameOrEmail(username);
  if (existingUsername) {
    throw new UserAlreadyExistsError('El nombre de usuario ya está registrado');
  }

  // Hashear contraseña
  const passwordHash = await passwordHasher.hash(password);

  // Generar ID de usuario amigable
  const id = `USR-${globalThis.crypto.randomUUID().split('-')[0].toUpperCase()}`;

  const user = new User({
    id,
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    username: username.trim().toLowerCase(),
    rol: parsedRol,
    estado: 'activo',
    passwordHash,
    fechaCreacion: new Date().toISOString().split('T')[0],
  });

  return userRepository.create(user);
}
