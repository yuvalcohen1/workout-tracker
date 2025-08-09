import { Router, Request, Response } from 'express';

import { UserDatabase } from '../database/users';
import { LoginRequest, RegisterRequest } from '../types/index';
import { PasswordUtils } from '../utils/password';
import { JWTUtils } from '../utils/jwt';
import { config } from '../env';
import { authenticateToken } from '../middleware/auth';

const authRrouter = Router();

// Register endpoint
authRrouter.post('/register', async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;
  
        // Check if user already exists
        const existingUser = await UserDatabase.findByEmail(email);
        if (existingUser) {
          res.status(409).json({
            error: 'Registration failed',
            message: 'User with this email already exists',
          });
          return;
        }
  
        // Hash password and create user
        const hashedPassword = await PasswordUtils.hash(password);
        const user = await UserDatabase.create(email, hashedPassword);
  
        // Generate JWT token
        const token = JWTUtils.sign(user);
  
        // Set secure cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
  
        res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: user.id,
            email: user.email,
          },
        });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
          error: 'Registration failed',
          message: 'Internal server error',
        });
      }
    }
  );

  // Login endpoint
  authRrouter.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;
  
        // Find user
        const user = await UserDatabase.findByEmail(email);
        if (!user) {
          res.status(401).json({
            error: 'Authentication failed',
            message: 'Invalid email or password',
          });
          return;
        }
  
        // Verify password
        const isPasswordValid = await PasswordUtils.verify(password, user.password);
        if (!isPasswordValid) {
          res.status(401).json({
            error: 'Authentication failed',
            message: 'Invalid email or password',
          });
          return;
        }
  
        // Generate JWT token
        const userPayload = { id: user.id, email: user.email };
        const token = JWTUtils.sign(userPayload);
  
        // Set secure cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
  
        res.json({
          message: 'Login successful',
          user: userPayload,
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
          error: 'Authentication failed',
          message: 'Internal server error',
        });
      }
    }
  );

  // Logout endpoint
  authRrouter.post('/logout', (req: Request, res: Response): void => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  
    res.json({
      message: 'Logout successful',
    });
  });

  // Get current user (protected)
  authRrouter.get(
    '/me',
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({
            error: 'Authentication required',
            message: 'No user found in request',
          });
          return;
        }
  
        const user = await UserDatabase.findById(req.user!.id);
        if (!user) {
          res.status(404).json({
            error: 'User not found',
            message: 'User no longer exists',
          });
          return;
        }
  
        res.json({
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
          },
        });
      } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
          error: 'Failed to get user',
          message: 'Internal server error',
        });
      }
    }
  );

  // Change password (protected)
  authRrouter.put(
    '/change-password',
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({
            error: 'Authentication required',
            message: 'No user found in request',
          });
          return;
        }
  
        const { currentPassword, newPassword } = req.body;
        
        // Get current user
        const user = await UserDatabase.findById(req.user.id);
        if (!user) {
          res.status(404).json({
            error: 'User not found',
            message: 'User no longer exists',
          });
          return;
        }
  
        // Verify current password
        const isCurrentPasswordValid = await PasswordUtils.verify(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          res.status(401).json({
            error: 'Password change failed',
            message: 'Current password is incorrect',
          });
          return;
        }
  
        // Hash new password and update
        const hashedNewPassword = await PasswordUtils.hash(newPassword);
        await UserDatabase.updatePassword(req.user.id, hashedNewPassword);
  
        res.json({
          message: 'Password changed successfully',
        });
      } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
          error: 'Password change failed',
          message: 'Internal server error',
        });
      }
    }
  );
  
  // Delete account (protected)
  authRrouter.delete(
    '/delete-account',
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({
            error: 'Authentication required',
            message: 'No user found in request',
          });
          return;
        }
  
        const deleted = await UserDatabase.delete(req.user.id);
        if (!deleted) {
          res.status(404).json({
            error: 'User not found',
            message: 'User no longer exists',
          });
          return;
        }
  
        // Clear cookie
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
  
        res.json({
          message: 'Account deleted successfully',
        });
      } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
          error: 'Account deletion failed',
          message: 'Internal server error',
        });
      }
    }
  );

  export default authRrouter;