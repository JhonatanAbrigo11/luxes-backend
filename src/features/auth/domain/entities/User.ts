/**
 * Entidad de dominio: Usuario autenticable.
 */
export class User {
  id: string;
  nombre: string;
  email: string;
  username: string;
  rol: string;
  roleId: string | null;
  estado: string;
  passwordHash: string;
  fechaCreacion: string;
  ultimoAcceso: string | null;

  constructor({
    id,
    nombre,
    email,
    username,
    rol,
    roleId = null,
    estado,
    passwordHash,
    fechaCreacion,
    ultimoAcceso = null,
  }: {
    id: string;
    nombre: string;
    email: string;
    username: string;
    rol: string;
    roleId?: string | null;
    estado: string;
    passwordHash: string;
    fechaCreacion: string;
    ultimoAcceso?: string | null;
  }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.username = username;
    this.rol = rol;
    this.roleId = roleId;
    this.estado = estado;
    this.passwordHash = passwordHash;
    this.fechaCreacion = fechaCreacion;
    this.ultimoAcceso = ultimoAcceso;
  }

  isActive(): boolean {
    return this.estado === 'activo';
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      username: this.username,
      rol: this.rol,
      roleId: this.roleId,
      estado: this.estado,
      fechaCreacion: this.fechaCreacion,
      ultimoAcceso: this.ultimoAcceso,
    };
  }
}
