/**
 * Middleware para restringir acceso según los roles permitidos.
 * Debe ser ejecutado después de authMiddleware.
 */
export function requireRoles(allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Usuario no autenticado',
                },
            });
        }
        if (!allowedRoles.includes(user.rol)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'No tienes permisos suficientes para acceder a este recurso',
                },
            });
        }
        return next();
    };
}
