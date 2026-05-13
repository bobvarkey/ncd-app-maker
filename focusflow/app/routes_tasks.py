"""CRUD task endpoints for FocusFlow."""

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Priority, Task, TaskStatus, User
from app.schemas import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskResponse])
def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: todo, in_progress, done"),
    priority_filter: Optional[str] = Query(None, alias="priority", description="Filter by priority: P0, P1, P2"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Task]:
    """Return all tasks for the authenticated user, with optional filters."""
    stmt = select(Task).where(Task.user_id == current_user.id)

    if status_filter:
        try:
            stmt = stmt.where(Task.status == TaskStatus(status_filter))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status value: {status_filter!r}",
            )

    if priority_filter:
        try:
            stmt = stmt.where(Task.priority == Priority(priority_filter))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid priority value: {priority_filter!r}",
            )

    stmt = stmt.order_by(Task.created_at.desc())
    tasks = db.execute(stmt).scalars().all()
    return list(tasks)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Task:
    """Create a new task for the authenticated user."""
    task = Task(
        user_id=current_user.id,
        title=payload.title,
        description=payload.description,
        priority=payload.priority,  # already validated by schema pattern
        status=payload.status,
        due_date=payload.due_date,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Task:
    """Update an existing task (partial update — only provided fields are changed)."""
    task = db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    ).scalar_one_or_none()

    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    update_data = payload.model_dump(exclude_unset=True)

    # Map string values to enum instances where applicable
    if "priority" in update_data and update_data["priority"] is not None:
        update_data["priority"] = Priority(update_data["priority"])
    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = TaskStatus(update_data["status"])

    for field, value in update_data.items():
        setattr(task, field, value)

    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """Delete a task owned by the authenticated user."""
    task = db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    ).scalar_one_or_none()

    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    db.delete(task)
    db.commit()
