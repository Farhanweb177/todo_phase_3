from datetime import datetime, timedelta
from typing import Optional
import os
import uuid
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, select
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..models.user import User, UserCreate
from ..database.database import get_session

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token configuration — read from environment with fallback
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-here-make-it-long-and-random")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Security scheme for API docs
security_scheme = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_user(user_create: UserCreate, session: Session) -> User:
    """Create a new user in the database."""
    hashed_password = get_password_hash(user_create.password)

    # Generate username from email prefix if not provided separately
    username = user_create.email.split('@')[0]

    # Ensure username is unique by appending numbers if needed
    base_username = username
    counter = 1
    while session.exec(select(User).where(User.username == username)).first():
        username = f"{base_username}{counter}"
        counter += 1

    db_user = User(
        email=user_create.email,
        username=username,
        hashed_password=hashed_password,
        first_name=user_create.firstName,
        last_name=user_create.lastName,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def authenticate_user(session: Session, username: str, password: str) -> Optional[User]:
    """Authenticate a user by username/email and password."""
    statement = select(User).where((User.username == username) | (User.email == username))
    user = session.exec(statement).first()

    if not user or not verify_password(password, user.hashed_password):
        return None

    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    session: Session = Depends(get_session)
) -> User:
    """Get the current user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user_uuid = uuid.UUID(user_id)
    except JWTError:
        raise credentials_exception

    statement = select(User).where(User.id == user_uuid)
    user = session.exec(statement).first()

    if user is None:
        raise credentials_exception

    return user
