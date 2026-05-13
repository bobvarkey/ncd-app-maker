"""Pydantic schemas for request/response serialisation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

# ---------------------------------------------------------------------------
# Enums — plain strings so they serialise cleanly into JSON
# ---------------------------------------------------------------------------


class PriorityStr(str):
    """Literal type alias for priority strings."""
    pass  # validated at the field level


class TaskStatusStr(str):
    """Literal type alias for status strings."""
    pass  # validated at the field level


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    """Public user representation returned by the API."""
    id: int
    email: str
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------


class Token(BaseModel):
    """JWT access token response."""
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    """Credentials for login."""
    email: EmailStr
    password: str


# ---------------------------------------------------------------------------
# Task
# ---------------------------------------------------------------------------


class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    priority: str = Field(default="P2", pattern=r"^(P0|P1|P2)$")
    status: str = Field(default="todo", pattern=r"^(todo|in_progress|done)$")
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    """Schema for updating an existing task (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    priority: Optional[str] = Field(None, pattern=r"^(P0|P1|P2)$")
    status: Optional[str] = Field(None, pattern=r"^(todo|in_progress|done)$")
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    """Public task representation returned by the API."""
    id: int
    user_id: int
    title: str
    description: Optional[str]
    priority: str
    status: str
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
