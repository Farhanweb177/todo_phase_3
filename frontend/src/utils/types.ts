// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// API Request types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
}

// API Response types
export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface ApiError {
  detail: string;
  status?: number;
}

// Form state types
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Task filter types
export interface TaskFilter {
  status?: 'all' | 'pending' | 'completed';
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Type guards
export function isTask(obj: unknown): obj is Task {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as Task).id === 'string' &&
    'title' in obj &&
    typeof (obj as Task).title === 'string' &&
    'status' in obj &&
    ((obj as Task).status === 'pending' || (obj as Task).status === 'completed')
  );
}

export function isAuthError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'detail' in error &&
    typeof (error as ApiError).detail === 'string'
  );
}

export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (isAuthError(error)) return error.detail;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}
