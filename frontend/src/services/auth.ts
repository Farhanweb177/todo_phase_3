import apiClient from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { User, RegisterRequest, LoginRequest, LoginResponse } from '@/utils/types';

// Register a new user
export const registerUser = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post<User>(API_ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
};

// Login user and return JWT tokens
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

// Get current authenticated user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

// Logout (client-side only - clear tokens)
export const logout = (): void => {
  // Token clearing is handled by clearAuthStorage in storage.ts
  // This function is here for consistency
};
