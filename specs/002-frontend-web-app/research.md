# Research Summary: Frontend Web Application

## Overview
This document summarizes research findings for implementing a Next.js frontend application with authentication and full API integration for the todo application. The frontend will consume the existing backend API defined in specs/001-todo-web-app/contracts/openapi.yaml.

## Decision: Frontend Framework - Next.js 16+ with App Router
**Rationale**: Next.js 16+ with App Router provides modern React development patterns with built-in routing, server components, and excellent performance. The App Router architecture aligns with the project's separation of concerns principle and enables clean route organization.

**Alternatives considered**:
- Create React App (CRA)
- Vite + React Router
- Remix

**Why Next.js App Router**:
- Built-in routing with file-system based organization
- Server and client components for optimal performance
- Automatic code splitting and optimization
- Native TypeScript support
- Excellent developer experience with fast refresh
- Aligns with constitution's production realism requirement

CRA is deprecated, Vite lacks built-in routing conventions, and Remix has different architectural patterns that don't align as well with the existing backend structure.

## Decision: Authentication Client Library - JWT with localStorage
**Rationale**: Given that Better Auth is configured on the backend with JWT tokens, the frontend will implement a custom authentication client that stores JWT tokens in localStorage and attaches them to API requests. This provides a simple, stateless authentication flow that aligns with the constitution's security and statelessness requirements.

**Alternatives considered**:
- Better Auth SDK for Next.js
- NextAuth.js
- Clerk
- Auth0

**Why custom JWT client**:
- Backend already implements Better Auth with JWT
- Full control over token storage and refresh logic
- No additional dependencies or third-party services
- Simple integration with existing API
- Aligns with separation of concerns (backend handles auth, frontend just stores/sends tokens)

Third-party solutions add unnecessary complexity when the backend already provides JWT-based authentication.

## Decision: API Client - Axios with Interceptors
**Rationale**: Axios provides a robust HTTP client with interceptor support for automatically attaching JWT tokens to requests and handling authentication errors globally. This enables centralized API logic and error handling.

**Alternatives considered**:
- Native Fetch API
- SWR with fetch
- React Query with fetch

**Why Axios**:
- Request/response interceptors for JWT attachment and error handling
- Better error handling than native fetch
- Automatic JSON transformation
- Request cancellation support
- Widely used and well-documented
- TypeScript support

Native fetch requires more boilerplate for interceptor-like behavior, while SWR and React Query are data-fetching libraries that still need an underlying HTTP client.

## Decision: State Management - React Context + Hooks
**Rationale**: For authentication state and simple UI state, React Context with hooks provides sufficient state management without additional dependencies. The application's state needs are modest (auth state, task list, loading states), making Context a good fit.

**Alternatives considered**:
- Redux Toolkit
- Zustand
- Jotai
- Recoil

**Why React Context**:
- No additional dependencies
- Simple authentication state management
- Built-in React feature
- Sufficient for application scope
- Easy testing
- Aligns with constitution's deterministic behavior principle

Redux and other state management libraries add complexity that's not needed for this application's scope.

## Decision: Form Handling - Controlled Components
**Rationale**: Use React controlled components for form inputs with custom validation logic. This provides full control over form state and validation without additional dependencies.

**Alternatives considered**:
- React Hook Form
- Formik
- Uncontrolled components with refs

**Why controlled components**:
- Simple forms with limited fields
- Full control over validation logic
- No additional dependencies
- Direct integration with component state
- Easy to test

React Hook Form and Formik are excellent libraries but add unnecessary overhead for the simple forms in this application.

## Decision: Styling Approach - Tailwind CSS
**Rationale**: Tailwind CSS provides utility-first styling with excellent responsive design support, small bundle sizes, and rapid development. It aligns with the constitution's production realism and responsive design requirements.

**Alternatives considered**:
- CSS Modules
- Styled Components
- Emotion
- Plain CSS

**Why Tailwind CSS**:
- Utility-first approach for rapid development
- Excellent responsive design utilities
- Purge CSS for small production bundles
- No runtime overhead
- Built-in design system
- Great TypeScript support

CSS-in-JS solutions add runtime overhead, while plain CSS/CSS Modules require more manual responsive breakpoint management.

## Decision: TypeScript for Type Safety
**Rationale**: TypeScript provides compile-time type checking, better IDE support, and improved code quality. It integrates seamlessly with Next.js and helps catch errors early.

**Why TypeScript**:
- Type safety for API contracts
- Better IDE autocomplete and refactoring
- Catch errors at compile time
- Self-documenting code
- Aligns with constitution's deterministic behavior principle
- Next.js has excellent TypeScript support

## Decision: Testing Strategy - Jest + React Testing Library
**Rationale**: Jest provides a complete testing solution with great React support, while React Testing Library promotes testing best practices by focusing on user behavior rather than implementation details.

**Alternatives considered**:
- Vitest
- Cypress for component testing
- Enzyme

**Why Jest + React Testing Library**:
- Industry standard for React testing
- Excellent Next.js integration
- Focus on user behavior testing
- Good mocking capabilities
- Fast execution
- Great documentation

Vitest is newer but Jest is more mature for React ecosystems. Enzyme is outdated and doesn't support modern React patterns well.

## Decision: Route Protection Strategy - Middleware + Client-Side Checks
**Rationale**: Use Next.js middleware for route protection at the edge, combined with client-side authentication context checks. This provides both server-side and client-side protection for protected routes.

**Implementation approach**:
- Middleware checks for JWT token in cookies/headers
- Client-side AuthContext provides authentication state
- Protected routes check auth state and redirect if unauthenticated
- API client intercepts 401 responses and redirects to sign-in

**Why this approach**:
- Defense in depth (both server and client protection)
- Fast redirects with middleware
- Better UX with client-side state awareness
- Aligns with security-by-design principle

## Decision: Error Handling - Centralized API Client Error Handler
**Rationale**: Implement error handling in the API client interceptor to centrally manage authentication errors (401), not found errors (404), and server errors (500). This ensures consistent error handling across the application.

**Approach**:
- 401 errors trigger sign-out and redirect to sign-in
- 404 errors show user-friendly "not found" messages
- 500 errors show generic error messages
- Network errors show connectivity messages
- Component-level error boundaries for React errors

## Performance Considerations
Based on the success criteria requirements:
- **Page load**: Target <1 second for dashboard load
- **API operations**: Target <2 seconds for CRUD operations
- **Route redirects**: Target <500ms for auth redirects

**Optimization strategies**:
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- API response caching with SWR or React Query (future enhancement)
- Lazy loading for non-critical components
- Tailwind CSS purging for minimal CSS bundle

## Security Considerations
Based on constitution's security-by-design principle:
- **JWT storage**: Store in httpOnly cookies if possible, or localStorage with XSS precautions
- **CSRF protection**: Use proper CORS configuration
- **Input validation**: Client-side validation + rely on backend validation
- **Secure routes**: All task operations require authentication
- **Token expiration**: Handle gracefully with auto-redirect to sign-in

## Development Workflow
- **Development server**: Next.js dev server with hot reload
- **Environment variables**: NEXT_PUBLIC_BACKEND_URL for API endpoint
- **Code quality**: ESLint + Prettier for consistent formatting
- **Git hooks**: Pre-commit hooks for linting and type checking (future enhancement)
