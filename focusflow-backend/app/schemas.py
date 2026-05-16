from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


# ── Auth ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    created_at: datetime
    subscription_tier: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Sessions ────────────────────────────────────────────────────────────────

class SessionCreate(BaseModel):
    start_time: datetime
    end_time: Optional[datetime] = None
    focus_score: Optional[float] = None
    notes: Optional[str] = None


class SessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    focus_score: Optional[float] = None
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


class SessionUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    focus_score: Optional[float] = None
    notes: Optional[str] = None


# ── Waitlist ────────────────────────────────────────────────────────────────

class WaitlistEntryCreate(BaseModel):
    email: EmailStr
    referred_by: Optional[str] = None


class WaitlistEntryResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    referred_by: Optional[str] = None

    model_config = {"from_attributes": True}
