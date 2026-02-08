# Quick Start Guide: Todo Full-Stack Web Application

## Prerequisites
- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- PostgreSQL-compatible database (Neon Serverless PostgreSQL)
- Docker (optional, for containerized development)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Configure Environment Variables
Copy the environment template and fill in your configuration:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - Connection string for Neon PostgreSQL database
- `BETTER_AUTH_SECRET` - Secret key for JWT signing (use a strong random value)
- `BETTER_AUTH_URL` - Base URL for the application (e.g., http://localhost:3000)

### 3. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

#### Database Setup
Initialize the database and run migrations:

```bash
cd backend/src/database
python database.py init
python database.py migrate
```

#### Start the Backend Server
```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`.

### 4. Frontend Setup
Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

#### Start the Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info (requires JWT)

### Task Endpoints
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/toggle` - Toggle task completion status

All endpoints except authentication routes require a valid JWT in the Authorization header:
```
Authorization: Bearer <jwt_token_here>
```

## Development Workflow

### Running Tests
Backend tests:
```bash
cd backend
pytest tests/
```

Frontend tests:
```bash
cd frontend
npm run test
```

### Adding New Features
1. Update the specification in `specs/001-todo-web-app/spec.md`
2. Update the plan in `specs/001-todo-web-app/plan.md` if needed
3. Generate new tasks with `/sp.tasks`
4. Implement using the agentic workflow

### Database Migrations
When you modify data models, create new migrations:

```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

## Project Structure
```
backend/
├── src/
│   ├── models/          # Data models using SQLModel
│   ├── api/            # API route definitions
│   ├── services/       # Business logic
│   ├── database/       # Database connection and migrations
│   └── main.py         # Application entry point
├── requirements.txt
└── tests/

frontend/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   ├── services/       # API clients and utilities
│   └── utils/          # Helper functions and types
├── package.json
└── next.config.js
```

## Troubleshooting

### Common Issues
- **Database connection errors**: Verify DATABASE_URL is correctly configured
- **JWT authentication fails**: Ensure BETTER_AUTH_SECRET matches between frontend and backend
- **API calls return 401**: Check that JWT tokens are properly included in requests
- **Frontend can't connect to backend**: Verify CORS settings in backend configuration

### Resetting Development Environment
To reset the database:
```bash
cd backend/src/database
python database.py drop-all
python database.py init
python database.py migrate
```

## Environment-Specific Configuration

### Development
- Enable FastAPI debug mode
- Enable React strict mode
- Enable detailed error logging

### Production
- Disable debug mode
- Enable SSL/HTTPS
- Set up proper logging and monitoring
- Optimize frontend assets