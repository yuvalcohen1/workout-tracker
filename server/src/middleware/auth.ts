import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { UserDatabase } from '../database/users';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ 
        error: 'Access denied', 
        message: 'No token provided' 
      });
      return;
    }

    // Verify token
    const payload = JWTUtils.verify(token);
    
    // Check if user still exists
    const user = await UserDatabase.findById(payload.id);
    if (!user) {
      res.status(401).json({ 
        error: 'Access denied', 
        message: 'User no longer exists' 
      });
      return;
    }

    // Add user to request
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ 
          error: 'Access denied', 
          message: 'Token expired' 
        });
        return;
      }
      
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ 
          error: 'Access denied', 
          message: 'Invalid token' 
        });
        return;
      }
    }

    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'Authentication failed' 
    });
  }
};