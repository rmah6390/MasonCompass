# Personalized Recommendations (Deliverable 4)

Only the recommendation feature is connected to the backend in this working copy. The existing profile editor, discovery and saved pages are untouched and remain Sprint 1 prototypes. The API reads a seeded demo profile and existing sample opportunities from persistent storage. Profile editing integration is a separate teammate task.

## Run (Windows PowerShell)

From the project root, terminal 1:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Terminal 2, from project root:

```powershell
cd frontend
npm ci
npm run dev
```

Open the Vite URL and click Recommendations. API docs: http://localhost:8000/docs.

## Database

SQLite is the default local database; PostgreSQL is supported through SQLAlchemy. To use PostgreSQL, create the masoncompass database, then set the following in terminal 1 before launching Uvicorn:

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/masoncompass"
```

Tables and sample records are created on startup. Do not commit credentials or database files. For a different demo profile, update the stored profile using your database tool; changing seed.json only affects a fresh database. Real SSO is out of scope.

## Test

From backend: `python -m unittest test_services`.

The service ranks by major (40 points), proportion of matched skills (up to 30), and matching interest phrases (10 each). Zero-score items are omitted. These are relevance rules, not verified eligibility.
