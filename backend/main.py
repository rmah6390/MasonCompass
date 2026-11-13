import json
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal, StudentProfile, Opportunity
from repositories import ProfileRepository, OpportunityRepository, SavedOpportunityRepository
from services import RecommendationService, ProfileService, OpportunityService, SearchFilterService, SavedOpportunityService

DEMO_STUDENT_ID = "demo-student"

@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(engine)
    seed = json.loads((Path(__file__).parent / "seed.json").read_text())
    with SessionLocal() as session:
        if not session.get(StudentProfile, DEMO_STUDENT_ID):
            session.add(StudentProfile(id=DEMO_STUDENT_ID, data=seed["student"]))
        for item in seed["opportunities"]:
            if not session.get(Opportunity, item["id"]):
                session.add(Opportunity(id=item["id"], data=item))
        session.commit()
    yield

app = FastAPI(title="MasonCompass API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
                   allow_methods=["*"], allow_headers=["*"])

def get_session():
    with SessionLocal() as session:
        yield session


# Saved Opportunities business service constructor
def get_saved_service(session):
    """Construct the Saved Opportunities business service."""
    return SavedOpportunityService(
        SavedOpportunityRepository(session),
        OpportunityRepository(session)
    )

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/profile")
def get_profile(session=Depends(get_session)):
    profile = ProfileService(ProfileRepository(session)).get_profile(DEMO_STUDENT_ID)
    if profile is None:
        raise HTTPException(404, "Student profile not found")
    return profile

@app.put("/api/profile")
def update_profile(profile: dict, session=Depends(get_session)):
    service = ProfileService(ProfileRepository(session))
    try:
        return service.save_profile(DEMO_STUDENT_ID, profile)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

@app.get("/api/recommendations")
def recommendations(session=Depends(get_session)):
    result = RecommendationService(ProfileRepository(session), OpportunityRepository(session)).recommend(DEMO_STUDENT_ID)
    if result is None:
        raise HTTPException(404, "Student profile not found")
    return result


# Search/filter endpoint for opportunities
@app.get("/api/opportunities")
def search_opportunities(keyword: str = "", category: str = "", major: str = "", location: str = "", session=Depends(get_session)):
    service = SearchFilterService(OpportunityRepository(session))
    return service.search(keyword=keyword, category=category, major=major, location=location)

@app.get("/api/opportunities/{opportunity_id}")
def get_opportunity_details(opportunity_id: str, session=Depends(get_session)):
    service = OpportunityService(OpportunityRepository(session))
    return service.get_details(opportunity_id)


# Saved Opportunities API
@app.get("/api/saved")
def get_saved_opportunities(session=Depends(get_session)):
    """Retrieve all opportunities saved by the demo student."""
    service = get_saved_service(session)
    return service.list_saved(DEMO_STUDENT_ID)


@app.post("/api/saved/{opportunity_id}")
def save_opportunity(opportunity_id: str, session=Depends(get_session)):
    """Save an opportunity to the student's bookmarks."""
    service = get_saved_service(session)
    return service.save_opportunity(DEMO_STUDENT_ID, opportunity_id)


@app.delete("/api/saved/{opportunity_id}")
def remove_saved_opportunity(opportunity_id: str, session=Depends(get_session)):
    """Remove an opportunity from the student's bookmarks."""
    service = get_saved_service(session)
    return service.remove_opportunity(DEMO_STUDENT_ID, opportunity_id)
