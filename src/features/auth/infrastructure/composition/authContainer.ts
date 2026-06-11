import { env } from '../../../../config/env.js';
import { AuthService } from '../../application/services/AuthService.js';
import { createAuthController } from '../adapters/http/authController.js';
import { BcryptPasswordAdapter } from '../adapters/security/bcryptPasswordAdapter.js';
import { JwtTokenAdapter } from '../adapters/security/jwtTokenAdapter.js';
import { PrismaUserAdapter } from '../adapters/persistence/prismaUserAdapter.js';
import { PrismaRoleAdapter } from '../adapters/persistence/prismaRoleAdapter.js';
import { PrismaAuditLogAdapter } from '../adapters/persistence/prismaAuditLogAdapter.js';
import { createAuthRoutes } from '../routes/authRoutes.js';

/**
 * Composition root: cablea puertos → adaptadores → servicios.
 */
export async function createAuthModule() {
  const passwordHasher = new BcryptPasswordAdapter();
  const tokenService = new JwtTokenAdapter({
    secret: env.jwtSecret,
    expiresIn: env.jwtExpiresIn,
  });
  const userRepository = new PrismaUserAdapter();
  const roleRepository = new PrismaRoleAdapter();
  const auditLogRepository = new PrismaAuditLogAdapter();

  const authService = new AuthService({
    userRepository,
    passwordHasher,
    tokenService,
    roleRepository,
    auditLogRepository,
  });

  const authController = createAuthController(authService);
  const authRoutes = createAuthRoutes(authController);

  return { authRoutes, authService };
}
