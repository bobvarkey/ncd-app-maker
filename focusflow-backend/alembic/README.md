# Alembic Setup

To initialize Alembic migrations for FocusFlow:

```bash
cd focusflow-backend
alembic init alembic
```

Then configure `alembic.ini`:
- Set `sqlalchemy.url` to your DATABASE_URL (or use `%` env var interpolation)

Edit `alembic/env.py` to import the `Base` metadata:

```python
from app.database import Base
from app.models import User, Session, WaitlistEntry  # noqa: ensure models loaded
target_metadata = Base.metadata
```

Then generate an initial migration:

```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```
