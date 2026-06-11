/**
 * Puerto de persistencia para el historial de auditoría.
 */
export abstract class AuditLogRepositoryPort {
  abstract create(log: {
    userId?: string;
    usuarioNom?: string;
    accion: string;
    modulo: string;
    detalle: string;
    severidad: string;
  }): Promise<any>;

  abstract findAll(filters?: {
    search?: string;
    userId?: string;
    modulo?: string;
    severidad?: string;
  }): Promise<any[]>;
}
