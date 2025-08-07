import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';
import { config } from '../env';

export class JWTUtils {
  static sign(payload: UserPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '7d'
    });
  }

  static verify(token: string): UserPayload {
    return jwt.verify(token, config.JWT_SECRET) as UserPayload;
  }

  static decode(token: string): UserPayload | null {
    try {
      return jwt.decode(token) as UserPayload;
    } catch {
      return null;
    }
  }
}