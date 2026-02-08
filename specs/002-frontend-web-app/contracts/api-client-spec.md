# API Client Specification: Frontend Web Application

## Overview
This document specifies the API client layer for the frontend application. The API client provides typed functions for all backend endpoints and handles authentication, error handling, and request/response transformation.

## Base Configuration

### API Client Setup
```typescript
// Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});
```

### Request Interceptor
Automatically attach JWT token to all requests:

```typescript
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor
Handle authentication errors and other common error cases:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to sign-in
      clearAuthState();
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);
```

## Authentication API

### Register User
**Endpoint**: `POST /auth/register`

**Function Signature**:
```typescript
async function registerUser(data: RegisterRequest): Promise<User>
```

**Request**:
```typescript
{
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
```

**Response** (201 Created):
```typescript
{
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}
```

**Error Cases**:
- 400: Invalid input or email already exists

### Login User
**Endpoint**: `POST /auth/login`

**Function Signature**:
```typescript
async function loginUser(data: LoginRequest): Promise<LoginResponse>
```

**Request**:
```typescript
{
  email: string;
  password: string;
}
```

**Response** (200 OK):
```typescript
{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
```

**Error Cases**:
- 401: Invalid credentials

**Side Effects**:
- Store accessToken in localStorage
- Store refreshToken in localStorage (if provided)

### Get Current User
**Endpoint**: `GET /auth/me`

**Function Signature**:
```typescript
async function getCurrentUser(): Promise<User>
```

**Headers**:
- Authorization: Bearer {accessToken}

**Response** (200 OK):
```typescript
{
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Error Cases**:
- 401: Not authenticated or invalid token

## Tasks API

### Get Tasks
**Endpoint**: `GET /tasks`

**Function Signature**:
```typescript
async function getTasks(filters?: TaskFilter): Promise<TasksResponse>
```

**Query Parameters**:
```typescript
{
  status?: 'all' | 'pending' | 'completed';  // Default: 'all'
  limit?: number;    // Default: 10, Max: 100
  offset?: number;   // Default: 0
}
```

**Headers**:
- Authorization: Bearer {accessToken}

**Response** (200 OK):
```typescript
{
  tasks: Task[];
  total: number;
}
```

**Error Cases**:
- 401: Not authenticated

### Get Task by ID
**Endpoint**: `GET /tasks/{id}`

**Function Signature**:
```typescript
async function getTaskById(id: string): Promise<Task>
```

**Path Parameters**:
- id: string (UUID)

**Headers**:
- Authorization: Bearer {accessToken}

**Response** (200 OK):
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

**Error Cases**:
- 401: Not authenticated
- 404: Task not found or not owned by user

### Create Task
**Endpoint**: `POST /tasks`

**Function Signature**:
```typescript
async function createTask(data: CreateTaskRequest): Promise<Task>
```

**Headers**:
- Authorization: Bearer {accessToken}

**Request**:
```typescript
{
  title: string;         // Required, max 200 chars
  description?: string;  // Optional, max 1000 chars
}
```

**Response** (201 Created):
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'pending';
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt: null;
}
```

**Error Cases**:
- 400: Invalid input (title missing or too long)
- 401: Not authenticated

### Update Task
**Endpoint**: `PUT /tasks/{id}`

**Function Signature**:
```typescript
async function updateTask(id: string, data: UpdateTaskRequest): Promise<Task>
```

**Path Parameters**:
- id: string (UUID)

**Headers**:
- Authorization: Bearer {accessToken}

**Request**:
```typescript
{
  title?: string;        // Max 200 chars
  description?: string;  // Max 1000 chars
  status?: 'pending' | 'completed';
}
```

**Response** (200 OK):
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

**Error Cases**:
- 400: Invalid input
- 401: Not authenticated
- 404: Task not found or not owned by user

### Delete Task
**Endpoint**: `DELETE /tasks/{id}`

**Function Signature**:
```typescript
async function deleteTask(id: string): Promise<void>
```

**Path Parameters**:
- id: string (UUID)

**Headers**:
- Authorization: Bearer {accessToken}

**Response** (204 No Content):
No response body

**Error Cases**:
- 401: Not authenticated
- 404: Task not found or not owned by user

### Toggle Task Completion
**Endpoint**: `PATCH /tasks/{id}/toggle`

**Function Signature**:
```typescript
async function toggleTaskCompletion(id: string): Promise<Task>
```

**Path Parameters**:
- id: string (UUID)

**Headers**:
- Authorization: Bearer {accessToken}

**Response** (200 OK):
```typescript
{
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';  // Toggled status
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;  // Set if status is 'completed', null if 'pending'
}
```

**Error Cases**:
- 401: Not authenticated
- 404: Task not found or not owned by user

## Error Handling

### Error Response Format
All API errors follow this format:

```typescript
{
  detail: string;  // Human-readable error message
}
```

### Error Types

**NetworkError**: Network connection failed
```typescript
class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

**AuthenticationError**: 401 Unauthorized
```typescript
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
```

**ValidationError**: 400 Bad Request
```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

**NotFoundError**: 404 Not Found
```typescript
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

### Error Handling Strategy

1. **401 Unauthorized**: Clear auth state, redirect to /auth/signin
2. **400 Bad Request**: Show validation error to user
3. **404 Not Found**: Show "resource not found" message
4. **500 Server Error**: Show generic error message
5. **Network Error**: Show "connection failed" message

## Token Management

### Store Token
```typescript
function setAccessToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}
```

### Retrieve Token
```typescript
function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}
```

### Clear Token
```typescript
function clearAccessToken(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}
```

### Token Expiration Handling
- When a 401 error is received, automatically clear tokens and redirect to sign-in
- No automatic token refresh (users must re-authenticate after expiration)

## Usage Examples

### Example: Login and Fetch Tasks
```typescript
// Login
const loginResponse = await loginUser({
  email: 'user@example.com',
  password: 'password123',
});

// Store token
setAccessToken(loginResponse.accessToken);

// Fetch tasks
const tasksResponse = await getTasks({ status: 'pending' });
console.log(tasksResponse.tasks);
```

### Example: Create and Update Task
```typescript
// Create task
const newTask = await createTask({
  title: 'Buy groceries',
  description: 'Milk, eggs, bread',
});

// Update task
const updatedTask = await updateTask(newTask.id, {
  status: 'completed',
});
```

### Example: Error Handling
```typescript
try {
  const task = await getTaskById('invalid-id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Task not found');
  } else if (error instanceof AuthenticationError) {
    console.error('Please sign in');
  } else {
    console.error('An error occurred');
  }
}
```

## Testing Considerations

### Mock API Responses
- All API functions should be mockable for testing
- Use dependency injection or module mocking
- Mock both success and error scenarios

### Test Cases
- Test successful API calls
- Test authentication errors (401)
- Test validation errors (400)
- Test not found errors (404)
- Test network errors
- Test token attachment to requests
- Test token expiration handling

## Performance Considerations

- **Request Timeout**: 10 seconds default
- **Retry Logic**: No automatic retries (user-initiated retry only)
- **Caching**: No caching at API client level (future enhancement: use SWR or React Query)
- **Request Cancellation**: Support cancellation for pending requests when component unmounts

## Security Considerations

- **Token Storage**: Store JWT in localStorage (consider httpOnly cookies for production)
- **HTTPS Only**: Always use HTTPS in production
- **CORS**: Backend must allow frontend origin
- **Input Validation**: Validate inputs before sending to API
- **Sensitive Data**: Never log tokens or user credentials
