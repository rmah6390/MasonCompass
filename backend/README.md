# MasonCompass Backend (Deliverable 4)

The Student Profile and Personalized Recommendations features are connected to the backend and database. Students can view, edit, and save their profile. Recommendations update based on the saved major, skills, and interests. The discovery and saved pages still use the Sprint 1 implementation.

## Requirements

- Python 3
- Node.js and npm

## Run on Mac

From the project root, open terminal 1:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

## Run on Windows (PowerShell)

From the project root, open terminal 1:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

## Run the Frontend (Mac or Windows)

Keep the backend running. Open terminal 2 from the project root:

```bash
cd frontend
npm ci
npm run dev
```

Open the Vite URL shown in the terminal. Click Profile to view or edit the demo student. Click Recommendations to see matching opportunities.

API documentation: http://localhost:8000/docs

## Database

SQLite is the default local database. Tables and sample records are created on startup. Profile changes are saved in the database. Changing seed.json only affects a fresh database.

PostgreSQL can also be configured through SQLAlchemy, but this integration was tested with SQLite. To configure PostgreSQL, create the masoncompass database and set DATABASE_URL before starting the backend.

Mac:

```bash
export DATABASE_URL="postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/masoncompass"
```

Windows PowerShell:

```powershell
$env:DATABASE_URL = "postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/masoncompass"
```

Do not commit credentials, virtual environments, or database files. The current MVP uses one demo student without real SSO.

## Tests

From the backend folder, run the following.

Mac (with the virtual environment activated):

```bash
python -m unittest test_services -v
```

Windows:

```powershell
.\.venv\Scripts\python.exe -m unittest test_services -v
```

All six tests passed locally: five profile tests and one recommendation test.

## Business Logic

- ProfileService checks and saves student information through ProfileRepository.
- RecommendationService ranks opportunities by major (40 points), matched skills (up to 30 points), and matching interests (10 points each). Zero-score items are omitted. These scores show relevance, not verified eligibility.

## Design Diagrams

- [Student Profile](../docs/Ridha-StudentProfile-Diagrams.md)
- [Personalized Recommendations](../docs/Sanaa-PersonalizedRecommendations-Diagrams.md)

Do not modify any other file or window.
