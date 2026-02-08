# Data Model: Todo Full-Stack Web Application

## Overview
This document defines the data models for the Todo Full-Stack Web Application, including entity definitions, relationships, and validation rules based on the feature specification.

## Entities

### User
Represents a registered user account with unique identification, authentication credentials, and personal profile information.

**Fields**:
- `id`: UUID (primary key, auto-generated)
- `email`: String (unique, required, valid email format)
- `password_hash`: String (required, hashed using secure algorithm)
- `first_name`: String (optional, max 50 characters)
- `last_name`: String (optional, max 50 characters)
- `created_at`: DateTime (auto-generated on creation)
- `updated_at`: DateTime (auto-generated on update)

**Validation Rules**:
- Email must be unique across all users
- Email must follow valid email format
- Password must be properly hashed (not stored in plain text)
- Email cannot be empty

**Relationships**:
- One-to-many with Task (one user can have many tasks)

### Task
Represents a todo item with title, description, status (pending/completed), timestamps, and ownership relationship to a specific user.

**Fields**:
- `id`: UUID (primary key, auto-generated)
- `title`: String (required, max 200 characters)
- `description`: Text (optional, max 1000 characters)
- `status`: String (required, enum: "pending", "completed")
- `user_id`: UUID (foreign key, references User.id, required)
- `created_at`: DateTime (auto-generated on creation)
- `updated_at`: DateTime (auto-generated on update)
- `completed_at`: DateTime (nullable, set when status changes to completed)

**Validation Rules**:
- Title must be provided and not empty
- Title must be between 1 and 200 characters
- Description must be no more than 1000 characters if provided
- Status must be either "pending" or "completed"
- Task must belong to a valid user (user_id must reference an existing User)
- User can only access tasks that belong to them

**Relationships**:
- Many-to-one with User (many tasks belong to one user)

## State Transitions

### Task Status Transitions
Tasks can transition between states based on user actions:

```
pending <---> completed
```

**Transitions**:
- From `pending` to `completed`: When user marks task as complete
- From `completed` to `pending`: When user marks task as incomplete

**Rules**:
- When changing to `completed`, set `completed_at` to current timestamp
- When changing to `pending`, set `completed_at` to null

## Indexes

### Database Performance Optimization
- Index on `User.email` for fast authentication lookups
- Index on `Task.user_id` for efficient user-specific task retrieval
- Composite index on `(Task.user_id, Task.status)` for filtered queries
- Index on `Task.created_at` for chronological ordering

## Security Considerations

### Data Access Controls
- All task queries must be filtered by the authenticated user's ID
- Direct access to tasks not owned by the authenticated user must be prevented
- API endpoints must validate that the requesting user owns the task being accessed

### Data Privacy
- User email addresses should be treated as personally identifiable information (PII)
- Passwords must never be stored in plain text
- All sensitive data transmission must occur over encrypted channels