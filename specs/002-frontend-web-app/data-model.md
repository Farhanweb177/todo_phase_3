# Data Model: Frontend Web Application

## Overview
This document defines the frontend data models (TypeScript interfaces and types) for the Todo Frontend Application. These models represent the data structures used for API communication and UI state management.

## Frontend Data Models

### User
Represents a registered user with profile information. Maps to the backend User entity from the API.

**TypeScript Interface**:
```typescript
interface User {
  id: string;              // UUID format
  email: string;           // Valid email address
  firstName?: string;      // Optional first name
  lastName?: string;       // Optional last name
  createdAt: string;       // ISO 8601 date-time
  updatedAt: string;       // ISO 8601 date-time
}
```

**Usage**:
- Returned from `/auth/me` endpoint
- Displayed in user profile sections
- Used for authentication state management

### Task
Represents a todo item with title, description, and completion status. Maps to the backend Task entity from the API.

**TypeScript Interface**:
```typescript
interface Task {
  id: string;              // UUID format
  title: string;           // Required, max 200 characters
  description?: string;    // Optional, max 1000 characters
  status: 'pending' | 'completed';  // Task completion status
  userId: string;          // UUID of the task owner
  createdAt: string;       // ISO 8601 date-time
  updatedAt: string;       // ISO 8601 date-time
  completedAt?: string;    // ISO 8601 date-time, null if not completed
}
```

**Usage**:
- Displayed in task lists and detail views
- Used for create, update, delete operations
- Filtered and sorted in dashboard

**Validation Rules** (client-side):
- Title: Required, 1-200 characters
- Description: Optional, max 1000 characters
- Status: Must be 'pending' or 'completed'

### AuthTokens
Represents JWT authentication tokens returned from login endpoint.

**TypeScript Interface**:
```typescript
interface AuthTokens {
  accessToken: string;     // JWT access token
  refreshToken?: string;   // JWT refresh token (optional)
  expiresIn: number;       // Token expiration in seconds
}
```

**Usage**:
- Stored in localStorage after successful login
- Attached to API requests in Authorization header
- Used for authentication state management

### AuthState
Represents the current authentication state in the application.

**TypeScript Interface**:
```typescript
interface AuthState {
  isAuthenticated: boolean;  // Whether user is logged in
  user: User | null;          // Current user data, null if not authenticated
  loading: boolean;           // Whether auth state is being loaded
  error: string | null;       // Authentication error message
}
```

**Usage**:
- Managed by AuthContext
- Used to conditionally render UI elements
- Determines route access

## API Request/Response Types

### RegisterRequest
Request payload for user registration.

**TypeScript Interface**:
```typescript
interface RegisterRequest {
  email: string;           // Valid email format
  password: string;        // Min 8 characters
  firstName?: string;      // Optional
  lastName?: string;       // Optional
}
```

### LoginRequest
Request payload for user login.

**TypeScript Interface**:
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### LoginResponse
Response from login endpoint.

**TypeScript Interface**:
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
```

### CreateTaskRequest
Request payload for creating a new task.

**TypeScript Interface**:
```typescript
interface CreateTaskRequest {
  title: string;           // Required, max 200 characters
  description?: string;    // Optional, max 1000 characters
}
```

### UpdateTaskRequest
Request payload for updating an existing task.

**TypeScript Interface**:
```typescript
interface UpdateTaskRequest {
  title?: string;          // Optional, max 200 characters
  description?: string;    // Optional, max 1000 characters
  status?: 'pending' | 'completed';  // Optional status update
}
```

### TasksResponse
Response from GET /tasks endpoint.

**TypeScript Interface**:
```typescript
interface TasksResponse {
  tasks: Task[];           // Array of tasks
  total: number;           // Total count of tasks
}
```

### ApiError
Standard error response from backend API.

**TypeScript Interface**:
```typescript
interface ApiError {
  detail: string;          // Error message
  status?: number;         // HTTP status code
}
```

## UI State Models

### FormState
Generic form state for form handling.

**TypeScript Interface**:
```typescript
interface FormState<T> {
  values: T;               // Form field values
  errors: Partial<Record<keyof T, string>>;  // Field-level errors
  touched: Partial<Record<keyof T, boolean>>; // Touched fields
  isSubmitting: boolean;   // Whether form is being submitted
  isValid: boolean;        // Whether form is valid
}
```

### TaskFilter
Filter options for task list.

**TypeScript Interface**:
```typescript
interface TaskFilter {
  status: 'all' | 'pending' | 'completed';  // Filter by status
  sortBy?: 'createdAt' | 'updatedAt' | 'title';  // Sort field
  sortOrder?: 'asc' | 'desc';  // Sort direction
}
```

### LoadingState
Generic loading state for async operations.

**TypeScript Interface**:
```typescript
interface LoadingState {
  isLoading: boolean;      // Whether operation is in progress
  error: string | null;    // Error message if operation failed
}
```

## State Transitions

### Authentication Flow
```
Unauthenticated → [Login] → Authenticated
Authenticated → [Logout] → Unauthenticated
Authenticated → [Token Expiry] → Unauthenticated
```

### Task Status Flow
```
pending → [Toggle/Update to completed] → completed
completed → [Toggle/Update to pending] → pending
```

## Validation Rules

### Client-Side Validation

**Email Validation**:
- Format: Standard email regex pattern
- Required for registration and login

**Password Validation**:
- Minimum length: 8 characters
- Required for registration and login
- No special character requirements (backend enforces)

**Task Title Validation**:
- Required: Must not be empty
- Maximum length: 200 characters
- Trim whitespace before validation

**Task Description Validation**:
- Optional field
- Maximum length: 1000 characters
- Trim whitespace before validation

## Type Guards

### Type guard functions for runtime type checking

**isTask**:
```typescript
function isTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    (obj.status === 'pending' || obj.status === 'completed')
  );
}
```

**isAuthError**:
```typescript
function isAuthError(error: any): error is ApiError {
  return (
    typeof error === 'object' &&
    typeof error.detail === 'string'
  );
}
```

## Constants

### API Response Status Codes
```typescript
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

### Task Status Values
```typescript
const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
```

### Storage Keys
```typescript
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;
```

## Notes

- All date-time fields use ISO 8601 format (e.g., "2026-02-07T10:00:00Z")
- UUIDs are represented as strings in the format "123e4567-e89b-12d3-a456-426614174000"
- Optional fields are denoted with `?` in TypeScript interfaces
- All models align with the backend API contract defined in specs/001-todo-web-app/contracts/openapi.yaml
- Client-side validation is defensive; backend validation is authoritative
