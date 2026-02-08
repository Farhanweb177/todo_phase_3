from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid
from .user import User


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    user_id: uuid.UUID = Field(foreign_key="user.id")


class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to User
    user: Optional[User] = Relationship()


class TaskCreate(SQLModel):
    """Accepts frontend create payload (title, description only — user_id set from auth)."""
    title: str
    description: Optional[str] = None


class TaskRead(SQLModel):
    """Returns task data in camelCase to match frontend expectations."""
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    status: str  # "pending" or "completed" — derived from completed bool
    userId: uuid.UUID
    createdAt: datetime
    updatedAt: datetime


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    status: Optional[str] = None  # accept "pending"/"completed" from frontend


class TaskList(SQLModel):
    tasks: list[TaskRead]
    total: int
