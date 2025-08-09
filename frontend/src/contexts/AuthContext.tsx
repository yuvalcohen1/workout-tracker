import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthAPI } from '../services/api';
import { User, AuthContextType, ApiError } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage (user data only)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        
        // Verify auth status with server (token will be sent via HttpOnly cookie)
        try {
          const currentUser = await AuthAPI.getCurrentUser();
          setUser(currentUser);
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch {
          // Not authenticated or token invalid, clear user data
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially corrupted user data
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthAPI.login({ email, password });
      
      // Only store user data in localStorage (token is now in HttpOnly cookie)
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthAPI.register({ email, password });
      
      // Only store user data in localStorage (token is now in HttpOnly cookie)
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};