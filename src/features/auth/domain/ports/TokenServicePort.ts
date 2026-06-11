/**
 * Puerto para emisión y verificación de tokens JWT.
 */
export abstract class TokenServicePort {
  abstract sign(payload: Record<string, any>): Promise<string>;
  abstract verify(token: string): Promise<Record<string, any>>;
}

