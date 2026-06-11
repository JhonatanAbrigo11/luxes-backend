import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultPasswordHash = await bcrypt.hash('luxes2026', 10);

  // 1. Sembrar Permisos
  const permissionsData = [
    { key: 'dashboard', name: 'Dashboard' },
    { key: 'pedidos', name: 'Pedidos' },
    { key: 'recepcion_pedidos', name: 'Recepción de Pedidos' },
    { key: 'entregas_pedidos', name: 'Entregas de Pedidos' },
    { key: 'clientes', name: 'Empresarias (Clientes)' },
    { key: 'abonos', name: 'Abonos' },
    { key: 'billetera_virtual', name: 'Billetera Virtual' },
    { key: 'transacciones_globales', name: 'Transacciones Globales' },
    { key: 'validacion_pagos', name: 'Validación de Pagos' },
    { key: 'gestion_financiera', name: 'Gestión Financiera (Bancos)' },
    { key: 'inventario', name: 'Inventario' },
    { key: 'marcas', name: 'Marcas' },
    { key: 'catalogos_logistica', name: 'Catálogos/Logística' },
    { key: 'control_caja', name: 'Control de Caja' },
    { key: 'analisis_cartera', name: 'Análisis de Cartera' },
    { key: 'registro_llamadas', name: 'Registro de Llamadas' },
    { key: 'fidelizacion_clientes', name: 'Fidelización de Clientes' },
    { key: 'usuarios_roles', name: 'Usuarios y Roles' },
    { key: 'cambios_devoluciones', name: 'Cambios y Devoluciones' },
    { key: 'configuracion_sistema', name: 'Configuración del Sistema' },
  ];

  console.log('Sembrando permisos...');
  const dbPermissions = [];
  for (const perm of permissionsData) {
    const dbPerm = await prisma.permission.upsert({
      where: { key: perm.key },
      update: { name: perm.name },
      create: { key: perm.key, name: perm.name },
    });
    dbPermissions.push(dbPerm);
  }

  // 2. Sembrar Roles
  console.log('Sembrando roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrador' },
    update: { description: 'Control Total del Sistema' },
    create: { name: 'Administrador', description: 'Control Total del Sistema' },
  });

  const clientServiceRole = await prisma.role.upsert({
    where: { name: 'Servicio al Cliente' },
    update: { description: 'Gestión operativa de cobros y pedidos' },
    create: { name: 'Servicio al Cliente', description: 'Gestión operativa de cobros y pedidos' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: { description: 'Acceso básico de consulta' },
    create: { name: 'User', description: 'Acceso básico de consulta' },
  });

  // 3. Relacionar Roles con Permisos
  console.log('Vinculando permisos a roles...');
  
  // Limpiar relaciones previas para evitar duplicados en el re-sembrado
  await prisma.rolePermission.deleteMany({});

  // Administrador: Todos los permisos
  for (const perm of dbPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Servicio al Cliente: la mayoría de los módulos excepto configuraciones críticas
  const scKeys = [
    'pedidos', 'recepcion_pedidos', 'entregas_pedidos', 'clientes', 'abonos',
    'billetera_virtual', 'inventario', 'marcas', 'catalogos_logistica', 'control_caja',
    'analisis_cartera', 'registro_llamadas', 'fidelizacion_clientes', 'cambios_devoluciones',
    'configuracion_sistema'
  ];
  for (const perm of dbPermissions.filter(p => scKeys.includes(p.key))) {
    await prisma.rolePermission.create({
      data: {
        roleId: clientServiceRole.id,
        permissionId: perm.id,
      },
    });
  }

  // User: solo módulos básicos
  const userKeys = ['dashboard', 'pedidos', 'recepcion_pedidos', 'entregas_pedidos', 'clientes', 'billetera_virtual', 'control_caja'];
  for (const perm of dbPermissions.filter(p => userKeys.includes(p.key))) {
    await prisma.rolePermission.create({
      data: {
        roleId: userRole.id,
        permissionId: perm.id,
      },
    });
  }

  // 4. Sembrar Usuarios
  console.log('Sembrando usuarios...');
  const usersData = [
    {
      id: 'USR-001',
      nombre: 'Admin Principal',
      email: 'admin@luxes.com',
      username: 'admin',
      rol: 'admin',
      roleId: adminRole.id,
      estado: 'activo',
      fechaCreacion: new Date('2025-01-15T00:00:00Z'),
    },
    {
      id: 'USR-002',
      nombre: 'María Fernanda Torres',
      email: 'maria.torres@luxes.com',
      username: 'maria.torres',
      rol: 'editor',
      roleId: clientServiceRole.id,
      estado: 'activo',
      fechaCreacion: new Date('2025-02-20T00:00:00Z'),
    },
    {
      id: 'USR-003',
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@luxes.com',
      username: 'carlos.mendoza',
      rol: 'visor',
      roleId: userRole.id,
      estado: 'activo',
      fechaCreacion: new Date('2025-03-10T00:00:00Z'),
    },
    {
      id: 'USR-004',
      nombre: 'Lucía Fernández',
      email: 'lucia.fernandez@luxes.com',
      username: 'lucia.fernandez',
      rol: 'editor',
      roleId: clientServiceRole.id,
      estado: 'inactivo',
      fechaCreacion: new Date('2025-04-05T00:00:00Z'),
    },
    {
      id: 'USR-005',
      nombre: 'Pedro Martínez',
      email: 'pedro.martinez@luxes.com',
      username: 'pedro.martinez',
      rol: 'visor',
      roleId: userRole.id,
      estado: 'activo',
      fechaCreacion: new Date('2025-05-12T00:00:00Z'),
    },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        roleId: user.roleId,
        rol: user.rol,
      },
      create: {
        ...user,
        passwordHash: defaultPasswordHash,
      },
    });
  }

  // 5. Sembrar Historial de Auditoría
  console.log('Sembrando bitácora de auditoría...');
  await prisma.auditLog.deleteMany({});

  const logsData = [
    {
      fecha: new Date('2026-06-04T17:05:00Z'),
      userId: 'USR-003',
      usuarioNom: 'Carlos Mendoza',
      accion: 'Eliminar pedido',
      modulo: 'Pedidos',
      detalle: 'Eliminó recibo completo OR-2026-845 y todos sus pedidos asociados.',
      severidad: 'Critico',
    },
    {
      fecha: new Date('2026-05-28T18:20:07Z'),
      userId: 'USR-003',
      usuarioNom: 'Carlos Mendoza',
      accion: 'Eliminar pedido',
      modulo: 'Pedidos',
      detalle: 'Eliminó recibo completo OR-2026-820 y todos sus pedidos asociados.',
      severidad: 'Critico',
    },
    {
      fecha: new Date('2026-04-30T18:27:34Z'),
      userId: 'USR-003',
      usuarioNom: 'Carlos Mendoza',
      accion: 'Desactivar usuario',
      modulo: 'Usuarios y Roles',
      detalle: 'Desactivó usuario: isabel_del_rocio_valiente_yagu',
      severidad: 'Critico',
    },
    {
      fecha: new Date('2026-04-25T17:57:24Z'),
      userId: 'USR-001',
      usuarioNom: 'Admin Principal',
      accion: 'Editar rol',
      modulo: 'Control de Caja',
      detalle: 'Realizó cierre de caja por 2673.42',
      severidad: 'Critico',
    },
  ];

  for (const log of logsData) {
    await prisma.auditLog.create({
      data: log,
    });
  }

  console.log('Sembrado finalizado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
