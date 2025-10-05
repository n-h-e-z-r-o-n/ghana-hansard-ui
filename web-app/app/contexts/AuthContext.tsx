'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updateData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
  isAdmin: () => boolean;
  isMemberOrAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear it
            apiClient.setToken(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiClient.setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(userData);
      return { success: response.success, message: response.message };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.setToken(null);
      router.push('/');
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.forgotPassword({ email });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return { success: false, message: error.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.resetPassword({ token, newPassword });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { success: false, message: error.message || 'Failed to reset password' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.changePassword({ currentPassword, newPassword });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      console.error('Change password error:', error);
      return { success: false, message: error.message || 'Failed to change password' };
    }
  };

  const updateProfile = async (updateData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.updateUserProfile(updateData);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
      return { success: response.success, message: response.message };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isMemberOrAdmin = (): boolean => {
    return user?.role === 'member' || user?.role === 'admin';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    refreshUser,
    isAdmin,
    isMemberOrAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}



