from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List, Optional
import uuid
from ..database.database import get_session
from ..models.task import Task, TaskCreate, TaskRead, TaskUpdate
from ..models.user import User
from ..services.task_service import (
    create_task,
    get_tasks,
    get_task_by_id,
    update_task,
    delete_task,
    toggle_task_completion
)
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


def task_to_read(task: Task) -> dict:
    """Convert a Task ORM object to a dict with camelCase keys and status field."""
    return {
        "id": str(task.id),
        "title": task.title,
        "description": task.description,
        "status": "completed" if task.completed else "pending",
        "userId": str(task.user_id),
        "createdAt": task.created_at.isoformat(),
        "updatedAt": task.updated_at.isoformat(),
    }


@router.get("/")
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all tasks for the authenticated user. Returns {tasks: [...], total: N}."""
    tasks = get_tasks(current_user, session, skip=skip, limit=limit)

    # Apply status filter if provided
    if status_filter == "pending":
        tasks = [t for t in tasks if not t.completed]
    elif status_filter == "completed":
        tasks = [t for t in tasks if t.completed]

    task_list = [task_to_read(t) for t in tasks]
    return {"tasks": task_list, "total": len(task_list)}


@router.post("/")
def create_new_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for the authenticated user."""
    db_task = create_task(task, current_user, session)
    return task_to_read(db_task)


@router.get("/{task_id}")
def read_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID for the authenticated user."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    db_task = get_task_by_id(task_uuid, current_user, session)

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task_to_read(db_task)


@router.put("/{task_id}")
def update_existing_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a task for the authenticated user."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    # Convert frontend "status" field to backend "completed" bool
    if task_update.status is not None:
        task_update.completed = task_update.status == "completed"
        task_update.status = None  # Don't pass to ORM

    db_task = update_task(task_uuid, task_update, current_user, session)

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task_to_read(db_task)


@router.delete("/{task_id}")
def delete_existing_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a task for the authenticated user."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    success = delete_task(task_uuid, current_user, session)

    if not success:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/toggle")
def toggle_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Toggle the completion status of a task for the authenticated user."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    db_task = toggle_task_completion(task_uuid, current_user, session)

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task_to_read(db_task)
