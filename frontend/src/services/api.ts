import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, ApiError } from '../types/auth';

// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests (essential for HttpOnly cookies)
});

// No response interceptor needed - handle auth errors in components

export class AuthAPI {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw {
        error: 'Network Error',
        message: 'Unable to connect to server. Please check your connection.',
      } as ApiError;
    }
  }

  static async register(credentials: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw {
        error: 'Network Error',
        message: 'Unable to connect to server. Please check your connection.',
      } as ApiError;
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Logout should succeed even if API call fails
      console.warn('Logout API call failed, but continuing with local cleanup');
    }
  }

  static async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
}

export default api;