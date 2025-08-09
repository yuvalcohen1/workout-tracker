export interface User {
    id: string;
    email: string;
    createdAt?: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    message: string;
    user: User;
  }
  
  export interface ApiError {
    error: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
  }