from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from pathlib import Path
from .api import auth, tasks
from .database.database import engine
from dotenv import load_dotenv
import os

# Load environment variables from backend root .env, override system vars
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path, override=True)

# Create the FastAPI app
app = FastAPI(title="Todo API", version="1.0.0")

# Add CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    """Create database tables on startup if they don't exist."""
    # Import models so SQLModel registers them
    from .models.user import User  # noqa: F401
    from .models.task import Task  # noqa: F401
    SQLModel.metadata.create_all(engine)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
