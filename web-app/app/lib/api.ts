// API client for communicating with the backend
import { API_CONFIG, getApiUrl } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
        this.currentUser = null; // Clear user when token is removed
      }
    }
  }

  // Set current user
  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    // Dummy authentication logic with test credentials
    const dummyUsers = [
      { email: 'admin@parliament.gh', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User' },
      { email: 'member@parliament.gh', password: 'member123', role: 'member', firstName: 'Parliament', lastName: 'Member' },
      { email: 'citizen@example.com', password: 'citizen123', role: 'citizen', firstName: 'Ghana', lastName: 'Citizen' },
      { email: 'test@test.com', password: 'test123', role: 'citizen', firstName: 'Test', lastName: 'User' }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = dummyUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      const dummyUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const token = `dummy_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.setToken(token);
      this.setCurrentUser(dummyUser);

      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: dummyUser
        }
      };
    } else {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User }>> {
    // Dummy registration logic
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email already exists (simulate validation)
    const existingEmails = [
      'admin@parliament.gh',
      'member@parliament.gh', 
      'citizen@example.com',
      'test@test.com'
    ];

    if (existingEmails.includes(userData.email)) {
      return {
        success: false,
        message: 'Email already exists. Please use a different email address.'
      };
    }

    // Validate password length
    if (userData.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.'
      };
    }

    // Create new user
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 1000,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'citizen',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Registration successful! You can now log in with your credentials.',
      data: {
        user: newUser
      }
    };
  }

  async logout(): Promise<ApiResponse> {
    // Dummy logout logic
    await new Promise(resolve => setTimeout(resolve, 500));
    this.setToken(null);
    this.setCurrentUser(null);
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    // Dummy forgot password logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `Password reset link has been sent to ${data.email}. Please check your email.`
    };
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    // Dummy reset password logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.newPassword.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.'
      };
    }
    
    return {
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    };
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    // Dummy change password logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.newPassword.length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters long.'
      };
    }
    
    return {
      success: true,
      message: 'Password has been changed successfully.'
    };
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    // Dummy get current user logic
    if (!this.token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }
    
    if (!this.currentUser) {
      return {
        success: false,
        message: 'No user data found'
      };
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: this.currentUser
      }
    };
  }

  async getUserProfile(): Promise<ApiResponse<{ user: User }>> {
    // Dummy get user profile logic
    return this.getCurrentUser();
  }

  async updateUserProfile(updateData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    // Dummy update user profile logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentUser = await this.getCurrentUser();
    if (!currentUser.success) {
      return currentUser;
    }
    
    const updatedUser = { ...currentUser.data!.user, ...updateData };
    
    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    };
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    // Dummy refresh token logic
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!this.token) {
      return {
        success: false,
        message: 'No token to refresh'
      };
    }
    
    const newToken = `dummy_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.setToken(newToken);
    
    const currentUser = await this.getCurrentUser();
    
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        user: currentUser.data!.user
      }
    };
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    // Dummy health check
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      message: 'API is healthy'
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get user role
  async getUserRole(): Promise<string | null> {
    try {
      const response = await this.getCurrentUser();
      return response.success ? response.data?.user.role || null : null;
    } catch {
      return null;
    }
  }

  // Check if user has specific role
  async hasRole(role: string): Promise<boolean> {
    const userRole = await this.getUserRole();
    return userRole === role;
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  // Check if user is member or admin
  async isMemberOrAdmin(): Promise<boolean> {
    const userRole = await this.getUserRole();
    return userRole === 'member' || userRole === 'admin';
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
  AuthResponse,
};

// Export the class for creating new instances if needed
export { ApiClient };
