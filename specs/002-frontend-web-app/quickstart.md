# Quick Start Guide: Frontend Web Application

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API running at http://localhost:8000 (from specs/001-todo-web-app)
- Git for version control

## Project Setup

### 1. Initialize Next.js Project

If starting fresh:
```bash
npx create-next-app@latest frontend --typescript --app --tailwind --eslint
cd frontend
```

If using existing project structure:
```bash
cd frontend
npm install
```

### 2. Install Dependencies

```bash
npm install axios
npm install jwt-decode
npm install --save-dev @types/jest @testing-library/react @testing-library/jest-dom jest ts-jest
```

**Core Dependencies**:
- `next@16.0.0` - Next.js framework with App Router
- `react@19.0.0` - React library
- `react-dom@19.0.0` - React DOM renderer
- `typescript@5.0.0` - TypeScript compiler
- `axios@1.7.0` - HTTP client for API requests
- `jwt-decode@4.0.0` - JWT token decoding

**Dev Dependencies**:
- `@types/react` - TypeScript types for React
- `@types/node` - TypeScript types for Node.js
- `jest` - Testing framework
- `@testing-library/react` - React component testing utilities
- `ts-jest` - TypeScript preprocessor for Jest

### 3. Configure Environment Variables

Create `.env.local` file in the frontend directory:

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional: Environment identifier
NEXT_PUBLIC_ENV=development
```

**Important**:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never store secrets or API keys in `NEXT_PUBLIC_` variables
- For production, update `NEXT_PUBLIC_BACKEND_URL` to the production API URL

### 4. Project Structure

Create the following directory structure:

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home/landing page
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx    # Sign-in page
│   │   │   └── register/
│   │   │       └── page.tsx    # Registration page
│   │   └── dashboard/
│   │       ├── page.tsx        # Dashboard (task list)
│   │       └── tasks/
│   │           └── [id]/
│   │               └── page.tsx  # Task detail page
│   ├── components/             # Reusable React components
│   │   ├── AuthProvider.tsx    # Authentication context provider
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── TaskList.tsx        # Task list component
│   │   ├── TaskForm.tsx        # Task create/edit form
│   │   └── TaskItem.tsx        # Individual task item
│   ├── services/               # API client and services
│   │   ├── api.ts              # API client instance
│   │   ├── auth.ts             # Authentication service
│   │   └── tasks.ts            # Tasks service
│   ├── utils/                  # Utility functions
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── validation.ts       # Form validation utilities
│   │   └── storage.ts          # LocalStorage utilities
│   └── __tests__/              # Test files
│       ├── components/
│       └── services/
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run start
```

### Run Tests

```bash
npm run test
```

### Lint Code

```bash
npm run lint
```

## Implementation Steps

### Step 1: Setup Base Configuration

1. **Configure TypeScript** (`tsconfig.json`):
   - Ensure strict mode is enabled
   - Configure path aliases for cleaner imports

2. **Configure Tailwind CSS** (`tailwind.config.ts`):
   - Set up color palette
   - Configure responsive breakpoints
   - Add custom utilities if needed

3. **Configure Next.js** (`next.config.js`):
   - Set up environment variables
   - Configure image optimization
   - Set up redirects if needed

### Step 2: Implement Type Definitions

Create `src/utils/types.ts` with all TypeScript interfaces:
- User
- Task
- AuthTokens
- AuthState
- Request/Response types
- Form state types

### Step 3: Implement API Client Layer

1. **Create API Client** (`src/services/api.ts`):
   - Set up Axios instance with base URL
   - Implement request interceptor for JWT attachment
   - Implement response interceptor for error handling

2. **Create Authentication Service** (`src/services/auth.ts`):
   - `registerUser(data: RegisterRequest): Promise<User>`
   - `loginUser(data: LoginRequest): Promise<LoginResponse>`
   - `getCurrentUser(): Promise<User>`
   - `logout(): void`

3. **Create Tasks Service** (`src/services/tasks.ts`):
   - `getTasks(filters?: TaskFilter): Promise<TasksResponse>`
   - `getTaskById(id: string): Promise<Task>`
   - `createTask(data: CreateTaskRequest): Promise<Task>`
   - `updateTask(id: string, data: UpdateTaskRequest): Promise<Task>`
   - `deleteTask(id: string): Promise<void>`
   - `toggleTaskCompletion(id: string): Promise<Task>`

### Step 4: Implement Authentication Context

Create `src/components/AuthProvider.tsx`:
- Manage authentication state (user, isAuthenticated, loading, error)
- Provide auth actions (login, register, logout, checkAuth)
- Handle token storage in localStorage
- Automatically check auth status on mount

### Step 5: Implement Pages

1. **Landing Page** (`src/app/page.tsx`):
   - Welcome message
   - Links to sign-in and register
   - Redirect to dashboard if already authenticated

2. **Sign-In Page** (`src/app/auth/signin/page.tsx`):
   - Email and password form
   - Form validation
   - Error message display
   - Redirect to dashboard on success

3. **Registration Page** (`src/app/auth/register/page.tsx`):
   - Email, password, first name, last name form
   - Form validation
   - Error message display
   - Redirect to sign-in on success

4. **Dashboard Page** (`src/app/dashboard/page.tsx`):
   - Protected route (requires authentication)
   - Display task list
   - Task filtering (all, pending, completed)
   - Create new task button
   - Sign-out button in navbar

5. **Task Detail Page** (`src/app/dashboard/tasks/[id]/page.tsx`):
   - Protected route
   - Display task details
   - Edit task form
   - Delete task button
   - Toggle completion button

### Step 6: Implement Components

1. **Navbar** (`src/components/Navbar.tsx`):
   - App title/logo
   - Navigation links
   - User profile display (if authenticated)
   - Sign-out button (if authenticated)

2. **TaskList** (`src/components/TaskList.tsx`):
   - Display array of tasks
   - Handle empty state
   - Loading state
   - Filter UI

3. **TaskForm** (`src/components/TaskForm.tsx`):
   - Title input (required, max 200 chars)
   - Description textarea (optional, max 1000 chars)
   - Submit button
   - Form validation
   - Loading state

4. **TaskItem** (`src/components/TaskItem.tsx`):
   - Display task title and status
   - Toggle completion checkbox
   - Edit button
   - Delete button (with confirmation)
   - Visual distinction for completed tasks

### Step 7: Implement Route Protection

Create middleware or HOC for protected routes:
- Check if user is authenticated
- Redirect to sign-in if not authenticated
- Allow access if authenticated

### Step 8: Add Error Handling

- Global error boundary for React errors
- API error handling in components
- User-friendly error messages
- Network error handling

### Step 9: Add Loading States

- Page-level loading indicators
- Button loading states during API calls
- Skeleton screens for data loading

### Step 10: Add Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive breakpoints for tablet and desktop
- Touch-friendly UI elements
- Mobile navigation menu

## Testing Strategy

### Unit Tests
- Test individual components (TaskForm, TaskList, TaskItem)
- Test utility functions (validation, storage)
- Test service functions (API client, auth, tasks)

### Integration Tests
- Test authentication flow (register → sign-in → dashboard)
- Test task CRUD operations
- Test route protection
- Test error handling

### End-to-End Tests (Future)
- Use Playwright or Cypress
- Test complete user journeys
- Test cross-browser compatibility

## Environment-Specific Configuration

### Development
- Backend URL: `http://localhost:8000`
- Detailed error messages
- Source maps enabled
- Hot module replacement

### Staging/QA
- Backend URL: Staging API endpoint
- Error logging enabled
- Performance monitoring
- Limited error details for users

### Production
- Backend URL: Production API endpoint (HTTPS)
- Minified and optimized bundles
- Error tracking (e.g., Sentry)
- Analytics enabled
- No console logs

## Common Issues and Solutions

### Issue: API requests failing with CORS errors
**Solution**: Ensure backend has CORS configured to allow frontend origin:
```python
# Backend: Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: JWT token not being sent with requests
**Solution**: Check that token is stored in localStorage and Axios interceptor is configured correctly.

### Issue: Protected routes accessible without authentication
**Solution**: Ensure authentication check is performed on route components and redirects are working.

### Issue: Form validation not working
**Solution**: Check that validation functions are called before form submission and error messages are displayed.

### Issue: Tasks not refreshing after create/update/delete
**Solution**: Ensure task list is refetched after mutations, or use optimistic updates.

## Next Steps

After completing the basic implementation:

1. **Add Testing**: Write unit and integration tests
2. **Improve UX**: Add animations, transitions, and better loading states
3. **Add Features**: Implement task search, sorting, and advanced filtering
4. **Optimize Performance**: Implement code splitting, lazy loading, and caching
5. **Add Accessibility**: Ensure keyboard navigation, screen reader support, ARIA labels
6. **Add Analytics**: Track user interactions and errors
7. **Deploy**: Deploy to Vercel, Netlify, or other hosting platform

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
