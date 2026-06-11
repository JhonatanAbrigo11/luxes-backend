import { AuditLogRepositoryPort } from '../../../domain/ports/AuditLogRepositoryPort.js';
import { prisma } from '../../../../../config/prismaClient.js';
export class PrismaAuditLogAdapter extends AuditLogRepositoryPort {
    async create(log) {
        return prisma.auditLog.create({
            data: {
                userId: log.userId || null,
                usuarioNom: log.usuarioNom || null,
                accion: log.accion,
                modulo: log.modulo,
                detalle: log.detalle,
                severidad: log.severidad,
            },
        });
    }
    async findAll(filters) {
        const whereClause = {};
        if (filters?.userId) {
            whereClause.userId = filters.userId;
        }
        if (filters?.modulo) {
            whereClause.modulo = filters.modulo;
        }
        if (filters?.severidad) {
            whereClause.severidad = { equals: filters.severidad, mode: 'insensitive' };
        }
        if (filters?.search) {
            whereClause.OR = [
                { usuarioNom: { contains: filters.search, mode: 'insensitive' } },
                { accion: { contains: filters.search, mode: 'insensitive' } },
                { detalle: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return prisma.auditLog.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
            orderBy: {
                fecha: 'desc',
            },
        });
    }
}
