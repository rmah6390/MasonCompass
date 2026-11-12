# Deliverable 4 - Student Profile Diagrams

**Author:** Ridha Mahmood  
**Project:** MasonCompass

## 1. Conceptual Class Diagram

A student has a profile. The profile helps find matching opportunities.

```mermaid
classDiagram
    class Student
    class Profile {
        fullName
        firstName
        major
        year
        skills
        interests
        careerGoal
    }
    class Opportunity {
        title
        category
        major
        skills
    }
    Student "1" -- "1" Profile : has
    Profile ..> Opportunity : helps match
```

## 2. Detailed Class Diagram

ProfileService checks the profile. ProfileRepository reads and saves it. StudentProfile stores the data.

```mermaid
classDiagram
    class ProfileService {
        +profiles: ProfileRepository
        +get_profile(student_id: str) dict
        +validate_profile(profile: dict) dict
        +save_profile(student_id: str, profile: dict) dict
    }
    class ProfileRepository {
        +session: Session
        +get(student_id: str) dict
        +save(student_id: str, profile: dict) dict
    }
    class StudentProfile {
        +id: str
        +data: dict
    }
    ProfileService --> ProfileRepository
    ProfileRepository ..> StudentProfile
```

The get methods can return None if the profile is missing. The types show what each method uses or returns.

## 3. Sequence Diagram

The student opens the profile, edits it, and saves it. The backend checks the changes before saving them.

```mermaid
sequenceDiagram
    actor Student
    participant UI as StudentProfile.jsx
    participant API as api.js
    participant Route as main.py
    participant Service as ProfileService
    participant Repo as ProfileRepository
    participant DB as SQLite

    Student->>UI: Open profile
    UI->>API: getProfile()
    API->>Route: GET /api/profile
    Route->>Service: get_profile(id)
    Service->>Repo: get(id)
    Repo->>DB: Read profile
    DB-->>Repo: Profile data
    Repo-->>Service: Profile data
    Service-->>Route: Profile data
    Route-->>API: Profile data
    API-->>UI: Show profile

    Student->>UI: Edit and save
    UI->>API: updateProfile(profile)
    API->>Route: PUT /api/profile
    Route->>Service: save_profile(id, profile)
    Service->>Service: validate_profile(profile)
    alt Valid profile
        Service->>Repo: save(id, profile)
        Repo->>DB: Save and commit
        DB-->>Repo: Saved data
        Repo-->>Service: Saved profile
        Service-->>Route: Saved profile
        Route-->>API: 200 OK
        API-->>UI: Show updated profile
    else Invalid profile
        Service-->>Route: ValueError
        Route-->>API: 400 Bad Request
        API-->>UI: Show error
    end
```

## 4. Layered Architecture Diagram

The UI sends requests to the backend. The business logic checks the data, and the database stores it.

```mermaid
flowchart TD
    subgraph UI[UI Layer]
        Form[StudentProfile.jsx] --> API[api.js]
        App[App.jsx] --> API
    end
    subgraph Logic[Application Layer]
        Routes[FastAPI - main.py] --> Profile[ProfileService]
        Routes --> Rec[RecommendationService]
    end
    subgraph Data[Persistence Layer]
        Repo[ProfileRepository] --> Model[SQLAlchemy]
        Opp[OpportunityRepository] --> Model
        Model --> DB[(SQLite)]
    end
    API -->|GET and PUT| Routes
    Profile --> Repo
    Rec --> Repo
    Rec --> Opp
```

Recommendations use the saved profile when the student opens the Recommendations page again.

## Source Code

| File | Purpose |
| --- | --- |
| [StudentProfile.jsx](../frontend/src/components/StudentProfile.jsx) | Display and edit profiles |
| [api.js](../frontend/src/api.js) | Send API requests |
| [main.py](../backend/main.py) | Handle requests |
| [services.py](../backend/services.py) | Check profile information |
| [repositories.py](../backend/repositories.py) | Read and save data |
| [database.py](../backend/database.py) | Shared database setup |
| [test_services.py](../backend/test_services.py) | Test business logic |
| [App.jsx](../frontend/src/App.jsx) | Load recommendations |

## Testing and Review

- All six unit tests passed, including five profile tests and one recommendation test.
- The profile saved successfully, and recommendations changed after editing it.
- The current MVP uses one demo student.
- Peer approval: Pending.
