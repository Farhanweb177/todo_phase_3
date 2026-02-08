from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    """Accepts frontend registration payload (email, password, firstName, lastName)."""
    email: str
    password: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None


class UserRead(SQLModel):
    """Returns user data in camelCase to match frontend expectations."""
    id: uuid.UUID
    email: str
    username: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime


class UserUpdate(SQLModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
