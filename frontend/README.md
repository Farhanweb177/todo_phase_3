# Todo App - Frontend

A Next.js-based task management application with JWT authentication, built with TypeScript and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

## Prerequisites

- Node.js 18+
- npm 9+
- Backend API running at `http://localhost:8000` (configurable)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example environment file and update values:

```bash
cp .env.example .env.local
```

Key environment variables:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_ENV` | Environment name | `development` |

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Run tests

```bash
npm test
```

### 5. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── auth/
│   │   ├── register/      # Registration page
│   │   └── signin/        # Sign-in page
│   └── dashboard/
│       ├── page.tsx       # Task dashboard (protected)
│       └── tasks/[id]/    # Task detail page (protected)
├── components/
│   ├── AuthProvider.tsx   # Auth context & state management
│   ├── Navbar.tsx         # Navigation with auth awareness
│   ├── TaskList.tsx       # Task list with empty state
│   ├── TaskItem.tsx       # Individual task card
│   ├── TaskForm.tsx       # Create/edit task form
│   ├── ConfirmDialog.tsx  # Confirmation modal
│   ├── ErrorBoundary.tsx  # React error boundary
│   ├── ErrorMessage.tsx   # Error display component
│   └── LoadingSpinner.tsx # Loading indicator
├── services/
│   ├── api.ts             # Axios instance with interceptors
│   ├── auth.ts            # Authentication API calls
│   └── tasks.ts           # Task CRUD API calls
├── utils/
│   ├── types.ts           # TypeScript interfaces & type guards
│   ├── validation.ts      # Form validation functions
│   ├── storage.ts         # localStorage utilities
│   └── constants.ts       # App constants & API endpoints
└── __tests__/             # Test files
```

## Features

- **Authentication**: Register, sign in, sign out with JWT tokens
- **Task Management**: Create, read, update, delete tasks
- **Task Toggling**: Mark tasks as completed/pending
- **Filtering**: Filter tasks by status (all/pending/completed)
- **Task Detail**: View full task details with inline editing
- **Responsive**: Mobile-first design with Tailwind CSS
- **Protected Routes**: Dashboard auto-redirects unauthenticated users
- **Session Handling**: Automatic redirect on token expiration

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm test` | Run test suite |
| `npx tsc --noEmit` | Type check without emitting |
| `npx eslint src/` | Lint source files |

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com). Connect your repository and set the environment variables in the Vercel dashboard. The build command (`next build`) and output directory are auto-detected.
