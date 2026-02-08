# Todo Full-Stack Web Application

A secure, multi-user todo web application with Next.js frontend, FastAPI backend, Neon PostgreSQL database, and JWT-based authentication.

## Features

- User registration and authentication with JWT tokens
- Secure todo management with user data isolation
- Create, read, update, delete, and toggle completion of tasks
- Responsive web interface
- RESTful API design

## Tech Stack

- **Frontend**: Next.js 16+ with App Router
- **Backend**: Python FastAPI
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel
- **Authentication**: Better Auth with JWT

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (or Neon DB account)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables (copy .env.example to .env and update values)
5. Set up the database (run migrations)
6. Start the development servers

## Environment Variables

Copy `.env` file and update values for your local setup.

## Development

### Backend
```bash
cd backend
uvicorn src.main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

## API Endpoints

- Authentication: `/api/auth/`
- Tasks: `/api/tasks/`

## Running with Docker

```bash
docker-compose up --build
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Create a virtual environment (recommended): `python -m venv venv && source venv/bin/activate` (Linux/Mac) or `python -m venv venv && venv\Scripts\activate` (Windows)
4. Copy `.env` to `.env.local` and update the database configuration
5. Start the server: `uvicorn src.main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and update configurations
4. Start the development server: `npm run dev`

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Security Features

- JWT-based authentication for all API endpoints
- User data isolation - users can only access their own tasks
- Password hashing using bcrypt
- CORS configured for development

## License

MIT