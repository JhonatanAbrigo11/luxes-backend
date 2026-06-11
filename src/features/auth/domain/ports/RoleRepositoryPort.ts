/**
 * Puerto de persistencia para roles y permisos.
 */
export abstract class RoleRepositoryPort {
  abstract findAll(): Promise<any[]>;
  abstract findById(id: string): Promise<any | null>;
  abstract findByName(name: string): Promise<any | null>;
  abstract create(role: { name: string; description?: string; permissions: string[] }): Promise<any>;
  abstract update(
    id: string,
    role: { name: string; description?: string; permissions: string[] }
  ): Promise<any>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAllPermissions(): Promise<any[]>;
}
