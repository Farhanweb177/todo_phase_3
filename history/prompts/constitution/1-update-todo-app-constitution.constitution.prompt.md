---
id: 1
title: Update Todo App Constitution
stage: constitution
date: 2026-02-06
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: user
command: /sp.constitution
labels: [constitution, spec-driven-development, todo-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text
/sp.constitution

Project: Todo Full-Stack Web Application (Agentic Dev Stack)

Objective:
Transform an in-memory CLI todo application into a secure, multi-user, full-stack web application with persistent storage, using spec-driven and agentic development only.

Core principles:
- Spec-first development (no implementation before specs)
- No manual coding (all code generated via Claude Code)
- Deterministic behavior (same inputs → same outputs)
- Security by design (authentication and authorization enforced at every layer)
- User data isolation (strict per-user access control)
- Production realism (real database, real auth, real API patterns)

Key standards:
- All features must trace directly to written specs
- Every API endpoint must be explicitly defined before implementation
- Authentication must use JWT-based stateless verification
- Task ownership must be enforced at database and API levels
- Frontend and backend must communicate only via documented REST APIs
- Environment variables used for all secrets and credentials
- Clear separation of concerns:
  - Frontend (Next.js)
  - Backend (FastAPI)
  - Database (Neon PostgreSQL)
  - Auth (Better Auth)

Technical constraints:
- Frontend: Next.js 16+ with App Router
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT enabled)
- API style: RESTful, JSON-only
- Auth header: Authorization: Bearer <JWT>
- Backend must be stateless (no session storage)

Security constraints:
- All API routes require a valid JWT
- Requests without or with invalid JWT return 401 Unauthorized
- User ID must be derived from JWT, not trusted from client input
- API queries must always filter by authenticated user ID
- Shared JWT secret configured via BETTER_AUTH_SECRET in all services
- Tokens must support expiration

Process constraints:
- Workflow must strictly follow:
  1. Write spec
  2. Generate plan
  3. Break into tasks
  4. Implement via Claude Code
- No skipping steps
- No hand-written patches or fixes
- All iteration
```

## Response snapshot

```text
I've updated the project constitution at `.specify/memory/constitution.md` based on your input. The constitution now reflects the principles and constraints for the Todo Full-Stack Web Application project:

1. Core Principles:
   - Spec-First Development: All implementation follows written specifications
   - No Manual Coding: All code generated via Claude Code agents
   - Deterministic Behavior: Identical inputs produce identical outputs
   - Security by Design: Auth enforced at every layer
   - Production Realism: Real systems used from start
   - Separation of Concerns: Clear boundaries between services

2. Technical Constraints: Frontend (Next.js), Backend (FastAPI), ORM (SQLModel), DB (Neon PostgreSQL), Auth (Better Auth)

3. Security Constraints: JWT authentication, 401 responses, user ID from JWT, API filtering by user ID

4. Process Constraints: Strict workflow of spec → plan → tasks → implementation

The constitution file has been updated with these principles, and includes governance rules. The version has been updated to 1.1.0 with today's date as both ratification and amendment date.
```

## Outcome

- ✅ Impact: Updated project constitution with specific principles for the Todo Full-Stack Web Application
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with comprehensive project principles
- 🔁 Next prompts: Ready to proceed with spec-driven development workflow
- 🧠 Reflection: The constitution now clearly defines the project's core principles, constraints, and governance rules, providing a solid foundation for the development process.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with spec creation for the todo application