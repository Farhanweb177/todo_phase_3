from typing import List, Optional
from datetime import datetime
from sqlmodel import Session, select
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
import uuid


def create_task(task_create: TaskCreate, user: User, session: Session) -> Task:
    """Create a new task for the authenticated user."""
    db_task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=False,
        user_id=user.id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


def get_tasks(user: User, session: Session, skip: int = 0, limit: int = 100) -> List[Task]:
    """Get all tasks for the authenticated user."""
    statement = select(Task).where(Task.user_id == user.id).offset(skip).limit(limit)
    tasks = session.exec(statement).all()

    return list(tasks)


def get_task_by_id(task_id: uuid.UUID, user: User, session: Session) -> Optional[Task]:
    """Get a specific task by ID for the authenticated user."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    task = session.exec(statement).first()

    return task


def update_task(task_id: uuid.UUID, task_update: TaskUpdate, user: User, session: Session) -> Optional[Task]:
    """Update a task for the authenticated user."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    db_task = session.exec(statement).first()

    if not db_task:
        return None

    # Update fields that were explicitly set
    update_data = task_update.model_dump(exclude_unset=True, exclude={"status"})
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db_task.updated_at = datetime.utcnow()

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


def delete_task(task_id: uuid.UUID, user: User, session: Session) -> bool:
    """Delete a task for the authenticated user."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    db_task = session.exec(statement).first()

    if not db_task:
        return False

    session.delete(db_task)
    session.commit()

    return True


def toggle_task_completion(task_id: uuid.UUID, user: User, session: Session) -> Optional[Task]:
    """Toggle the completion status of a task for the authenticated user."""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    db_task = session.exec(statement).first()

    if not db_task:
        return None

    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.utcnow()

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task
