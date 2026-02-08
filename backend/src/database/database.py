from sqlmodel import create_engine, Session
from typing import Generator
from pathlib import Path
import os
from dotenv import load_dotenv

# Load .env from the backend root directory, override any system env vars
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(env_path, override=True)

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine with SSL support for Neon
connect_args = {}
if "neon.tech" in DATABASE_URL:
    connect_args = {"sslmode": "require"}

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session