from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models import WaitlistEntry
from app.schemas import WaitlistEntryCreate, WaitlistEntryResponse

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


@router.post("", response_model=WaitlistEntryResponse, status_code=status.HTTP_201_CREATED)
def add_to_waitlist(payload: WaitlistEntryCreate, db: DBSession = Depends(get_db)):
    existing = db.query(WaitlistEntry).filter(WaitlistEntry.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already on waitlist",
        )
    entry = WaitlistEntry(email=payload.email, referred_by=payload.referred_by)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/count")
def waitlist_count(db: DBSession = Depends(get_db)):
    count = db.query(WaitlistEntry).count()
    return {"count": count}
