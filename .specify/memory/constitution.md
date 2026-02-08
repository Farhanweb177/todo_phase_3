<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: All 6 principles completely revised
- Added sections: Core Principles (6), Technical Constraints, Security Constraints, Process Constraints
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (updated)
  - ✅ .specify/templates/spec-template.md (updated)
  - ✅ .specify/templates/tasks-template.md (updated)
- Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution

## Core Principles

### Spec-First Development
All implementation must strictly follow written specifications; No code implementation before complete feature specification is documented and approved; Every feature requirement must be traceable to a written spec with acceptance criteria.

### No Manual Coding
All code must be generated via Claude Code agents; No hand-written code patches or fixes allowed; All development must follow the agentic workflow with explicit task breakdowns; Manual overrides are prohibited except for emergency rollbacks.

### Deterministic Behavior
Identical inputs must produce identical outputs; System behavior must be predictable and reproducible; State management must be explicit and well-defined; All processes must be idempotent where possible.

### Security by Design
Authentication and authorization must be enforced at every layer; User data isolation is mandatory; All API endpoints require proper authentication; Security controls must be built-in, not added later; Defense in depth approach required.

### Production Realism
Real database systems must be used from the start; Authentication systems must be production-grade; API patterns must follow industry standards; Secrets must be managed via environment variables; Statelessness must be maintained where applicable.

### Separation of Concerns
Clear boundaries between frontend (Next.js), backend (FastAPI), database (Neon PostgreSQL), and auth (Better Auth); Services must communicate only via documented REST APIs; Cross-cutting concerns must be properly abstracted; Loose coupling and high cohesion principles applied.

## Technical Constraints
- Frontend: Next.js 16+ with App Router
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT enabled)
- API style: RESTful, JSON-only
- Auth header: Authorization: Bearer <JWT>
- Backend must be stateless (no session storage)

## Security Constraints
- All API routes require a valid JWT
- Requests without or with invalid JWT return 401 Unauthorized
- User ID must be derived from JWT, not trusted from client input
- API queries must always filter by authenticated user ID
- Shared JWT secret configured via BETTER_AUTH_SECRET in all services
- Tokens must support expiration
- Task ownership must be enforced at database and API levels
- User data isolation (strict per-user access control)

## Process Constraints
Workflow must strictly follow:
1. Write spec
2. Generate plan
3. Break into tasks
4. Implement via Claude Code

- No skipping steps
- No hand-written patches or fixes
- All iteration must follow the established workflow
- Frontend and backend must communicate only via documented REST APIs
- Environment variables used for all secrets and credentials

## Governance

This constitution supersedes all other development practices. All development work must comply with these principles. Amendments require explicit documentation, approval process, and migration plan. All pull requests and reviews must verify constitutional compliance. All API endpoints must be explicitly defined before implementation. Authentication must use JWT-based stateless verification.

**Version**: 1.1.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-06
