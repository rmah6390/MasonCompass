# MasonCompass Backend (Deliverable 4)

The Student Profile, Personalized Recommendations, Opportunity Details, Opportunity Search and Filtering, and Saved Opportunities features are connected to the backend and database. Students can view, edit, and save their profile. Recommendations update based on the saved major, skills, and interests. Opportunity Details retrieves the selected opportunity from the database. The Discover page searches and filters database opportunities by keyword, category, major, and location. Students can bookmark opportunities, view their saved list, and remove bookmarks. Saved opportunities are stored in the database.

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

Open the Vite URL shown in the terminal. Click Profile to view or edit the demo student. Click Recommendations to see matching opportunities. Click Discover to browse internships, research, or scholarships and search or filter by keyword, major, and location. Click Clear filters to reset the search. Click View Details to see the selected opportunity. Click the heart icon to bookmark an opportunity. Click Saved to view bookmarked opportunities, and click Remove Saved to remove a bookmark.

API documentation: http://localhost:8000/docs

Opportunity Search and Filtering endpoint: GET /api/opportunities

Optional query parameters: keyword, category, major, location.

Example: http://localhost:8000/api/opportunities?keyword=software&category=Internships&major=Computer%20Science&location=Arlington

The endpoint returns matching opportunities or an empty list if no opportunities match.

Opportunity Details endpoint: GET /api/opportunities/{opportunity_id}

Example: http://localhost:8000/api/opportunities/software-engineering-intern

An unknown opportunity ID returns 404 Not Found. Sample opportunities may not have an official posting link.

Saved Opportunities endpoints:

- GET /api/saved - Retrieve the demo student's saved opportunities.
- POST /api/saved/{opportunity_id} - Save an existing opportunity without creating duplicates.
- DELETE /api/saved/{opportunity_id} - Remove a saved opportunity.

An unknown opportunity ID on save or missing bookmark on removal returns 404 Not Found.

## Database

SQLite is the default local database. Tables and sample records are created on startup. Profile changes and saved opportunities are stored in the database. Changing seed.json only affects a fresh database.

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

All 25 unit tests passed locally: five profile tests, one recommendation test, three opportunity details tests, eight search and filtering tests, and eight saved opportunities tests. The search tests cover listing all opportunities, keyword search, category, major, location, combined filters, no results, and clearing filters. The saved opportunities tests cover saving and retrieving, duplicate prevention, removal, missing opportunities, missing bookmarks, student isolation, deleted opportunities, and blank identifiers. The tests use fake repositories. Local API testing with SQLite also confirmed saving, retrieving, duplicate prevention, and removal. Browser testing confirmed a matching combined search, no-results handling, navigation to Opportunity Details, and Saved Opportunities functionality. The frontend production build passed.

## Business Logic

- ProfileService checks and saves student information through ProfileRepository.
- RecommendationService ranks opportunities by major (40 points), matched skills (up to 30 points), and matching interests (10 points each). Zero-score items are omitted. These scores show relevance, not verified eligibility.
- OpportunityService retrieves opportunity details through OpportunityRepository and checks for missing or invalid IDs.
- SearchFilterService (Sadia Mou) retrieves opportunities through OpportunityRepository and filters them by keyword, category, major, and location. The existing discovery interface sends filter selections to the backend and displays the matching results.
- SavedOpportunityService (Taj Dhaliwal) validates opportunity IDs, retrieves saved opportunity details, prevents duplicate bookmarks, and removes bookmarks through SavedOpportunityRepository. The frontend uses the saved opportunities API to keep bookmark state and the Saved page connected to the database.

## Design Diagrams

- [Student Profile](../docs/Ridha-StudentProfile-Diagrams.md)
- [Personalized Recommendations](../docs/Sanaa-PersonalizedRecommendations-Diagrams.md)
- [Opportunity Search and Filtering](../docs/Sadia-SearchFilter-Diagrams.md)
