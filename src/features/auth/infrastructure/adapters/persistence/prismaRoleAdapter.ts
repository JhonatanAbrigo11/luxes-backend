import { RoleRepositoryPort } from '../../../domain/ports/RoleRepositoryPort.js';
import { prisma } from '../../../../../config/prismaClient.js';

export class PrismaRoleAdapter extends RoleRepositoryPort {
  async findAll(): Promise<any[]> {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return roles.map((r) => {
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: r.permissions.map((rp) => rp.permission.key),
      };
    });
  }

  async findById(id: string): Promise<any | null> {
    const r = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!r) return null;

    return {
      id: r.id,
      name: r.name,
      description: r.description,
      permissions: r.permissions.map((rp) => rp.permission.key),
    };
  }

  async findByName(name: string): Promise<any | null> {
    const r = await prisma.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!r) return null;

    return {
      id: r.id,
      name: r.name,
      description: r.description,
      permissions: r.permissions.map((rp) => rp.permission.key),
    };
  }

  async create(role: { name: string; description?: string; permissions: string[] }): Promise<any> {
    const newRole = await prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
      },
    });

    if (role.permissions && role.permissions.length > 0) {
      const dbPerms = await prisma.permission.findMany({
        where: {
          key: { in: role.permissions },
        },
      });

      for (const p of dbPerms) {
        await prisma.rolePermission.create({
          data: {
            roleId: newRole.id,
            permissionId: p.id,
          },
        });
      }
    }

    return this.findById(newRole.id);
  }

  async update(
    id: string,
    role: { name: string; description?: string; permissions: string[] }
  ): Promise<any> {
    await prisma.role.update({
      where: { id },
      data: {
        name: role.name,
        description: role.description,
      },
    });

    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    if (role.permissions && role.permissions.length > 0) {
      const dbPerms = await prisma.permission.findMany({
        where: {
          key: { in: role.permissions },
        },
      });

      for (const p of dbPerms) {
        await prisma.rolePermission.create({
          data: {
            roleId: id,
            permissionId: p.id,
          },
        });
      }
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await prisma.role.delete({
      where: { id },
    });
    return !!deleted;
  }

  async findAllPermissions(): Promise<any[]> {
    return prisma.permission.findMany({
      orderBy: {
        key: 'asc',
      },
    });
  }
}
