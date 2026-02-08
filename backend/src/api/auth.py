from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from datetime import timedelta
from ..database.database import get_session
from ..models.user import User, UserCreate, UserRead
from ..services.auth_service import (
    create_user,
    authenticate_user,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    """Accepts frontend login payload (email + password as JSON body)."""
    email: str
    password: str


def user_to_read(user: User) -> dict:
    """Convert a User ORM object to a UserRead-compatible dict with camelCase keys."""
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "createdAt": user.created_at,
        "updatedAt": user.updated_at,
    }


@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    """Register a new user."""
    # Check if user already exists by email
    existing_user = session.exec(select(User).where(User.email == user.email)).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    db_user = create_user(user, session)
    return user_to_read(db_user)


@router.post("/login")
def login(login_data: LoginRequest, session: Session = Depends(get_session)):
    """Login with email and password to get JWT token."""
    user = authenticate_user(session, login_data.email, login_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return {
        "accessToken": access_token,
        "tokenType": "bearer",
        "expiresIn": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user."""
    return user_to_read(current_user)
