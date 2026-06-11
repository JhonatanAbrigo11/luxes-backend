export class AuthError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code = 'AUTH_ERROR', statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Credenciales inválidas', 'INVALID_CREDENTIALS', 401);
  }
}

export class InactiveUserError extends AuthError {
  constructor() {
    super('Usuario inactivo', 'INACTIVE_USER', 403);
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(message = 'El usuario o correo electrónico ya está registrado') {
    super(message, 'USER_ALREADY_EXISTS', 409);
  }
}


