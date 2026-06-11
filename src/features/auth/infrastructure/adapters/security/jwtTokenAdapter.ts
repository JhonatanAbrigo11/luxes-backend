import jwt from 'jsonwebtoken';
import { TokenServicePort } from '../../../domain/ports/TokenServicePort.js';

interface JwtTokenAdapterOptions {
  secret: string;
  expiresIn: string;
}

/**
 * Adaptador de infraestructura: JWT para tokens de sesión.
 */
export class JwtTokenAdapter extends TokenServicePort {
  private secret: string;
  private expiresIn: string;

  constructor({ secret, expiresIn }: JwtTokenAdapterOptions) {
    super();
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload: Record<string, any>): Promise<string> {
    return Promise.resolve(
      jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any }),
    );
  }


  verify(token: string): Promise<Record<string, any>> {
    try {
      const decoded = jwt.verify(token, this.secret);
      return Promise.resolve(decoded as Record<string, any>);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

