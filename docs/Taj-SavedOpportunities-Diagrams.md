# Saved Opportunities — Design Diagrams

**MasonCompass | CS 321 | Deliverable 4**  
**Contributor:** Taj Dhaliwal  
**Status:** Backend code implemented and shared for integration; runtime testing, frontend API wiring, and peer review pending.

## 1. Conceptual Class Diagram

The conceptual model associates students with opportunities through bookmark records. The relationships are logical; the current database model stores IDs without explicit foreign-key constraints.

```mermaid
classDiagram
    direction LR
    class Student {
        studentId
        profile
    }
    class Opportunity {
        opportunityId
        title
        category
        description
    }
    class SavedOpportunity {
        id
        studentId
        opportunityId
    }
    Student "1" --> "0..*" SavedOpportunity : saves
    Opportunity "1" <-- "0..*" SavedOpportunity : references
```

## 2. Detailed Class Diagram

This diagram reflects the classes and methods added to the existing backend. The `SavedOpportunity` table uses a string ID plus student and opportunity identifiers.

```mermaid
classDiagram
    direction TB
    class SavedOpportunity {
        +str id
        +str student_id
        +str opportunity_id
    }
    class Opportunity {
        +str id
        +dict data
    }
    class SavedOpportunityRepository {
        +session
        +list_by_student(student_id)
        +get_by_student_and_opportunity(student_id, opportunity_id)
        +save(student_id, opportunity_id)
        +remove(student_id, opportunity_id)
    }
    class OpportunityRepository {
        +session
        +list_all()
        +get(opportunity_id)
    }
    class SavedOpportunityService {
        +saved_repository
        +opportunity_repository
        +list_saved(student_id)
        +save_opportunity(student_id, opportunity_id)
        +remove_opportunity(student_id, opportunity_id)
    }
    SavedOpportunityService --> SavedOpportunityRepository : uses
    SavedOpportunityService --> OpportunityRepository : validates and retrieves
    SavedOpportunityRepository --> SavedOpportunity : persists
    OpportunityRepository --> Opportunity : reads
    SavedOpportunity ..> Opportunity : references ID
```

## 3. Sequence Diagram

The API operations are implemented in `main.py`. React-to-API calls are the intended integration path and remain unverified.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as React UI (integration pending)
    participant API as FastAPI
    participant Service as SavedOpportunityService
    participant SavedRepo as SavedOpportunityRepository
    participant OppRepo as OpportunityRepository
    participant DB as SQLite

    Student->>UI: Save an opportunity
    UI->>API: POST /api/saved/{opportunity_id}
    API->>Service: save_opportunity(student_id, opportunity_id)
    Service->>OppRepo: get(opportunity_id)
    OppRepo->>DB: Read opportunity
    DB-->>OppRepo: Opportunity or missing
    OppRepo-->>Service: Result
    alt Opportunity missing
        Service-->>API: HTTP 404
    else Opportunity exists
        Service->>SavedRepo: get_by_student_and_opportunity(...)
        SavedRepo->>DB: Read bookmark
        DB-->>SavedRepo: Bookmark or missing
        SavedRepo-->>Service: Result
        alt Already saved
            Service-->>API: Already saved response
        else Not saved
            Service->>SavedRepo: save(...)
            SavedRepo->>DB: INSERT and COMMIT
            SavedRepo-->>Service: Saved record
            Service-->>API: Save success
        end
    end
    API-->>UI: HTTP response

    Student->>UI: Open Saved page
    UI->>API: GET /api/saved
    API->>Service: list_saved(student_id)
    Service->>SavedRepo: list_by_student(student_id)
    SavedRepo->>DB: SELECT bookmarks
    DB-->>SavedRepo: Saved records
    SavedRepo-->>Service: Records
    loop Each bookmark
        Service->>OppRepo: get(opportunity_id)
        OppRepo->>DB: Read opportunity
        DB-->>OppRepo: Opportunity or missing
        OppRepo-->>Service: Result
    end
    Service-->>API: Existing saved opportunities
    API-->>UI: JSON array

    Student->>UI: Remove bookmark
    UI->>API: DELETE /api/saved/{opportunity_id}
    API->>Service: remove_opportunity(student_id, opportunity_id)
    Service->>SavedRepo: remove(student_id, opportunity_id)
    SavedRepo->>DB: Look up bookmark
    alt Bookmark exists
        SavedRepo->>DB: DELETE and COMMIT
        SavedRepo-->>Service: true
        Service-->>API: Removal success
    else Bookmark missing
        SavedRepo-->>Service: false
        Service-->>API: HTTP 404
    end
    API-->>UI: HTTP response
```

## 4. Layered Architecture Diagram

Solid connections represent implemented backend calls. Dashed connections represent frontend wiring that still requires integration and testing.

```mermaid
flowchart TB
    subgraph Presentation[Presentation Layer — React and Vite]
        UI[Saved Opportunities Page and Bookmark Buttons]
    end
    subgraph API[API Layer — FastAPI main.py]
        GET[GET /api/saved]
        POST[POST /api/saved/id]
        DELETE[DELETE /api/saved/id]
    end
    subgraph Business[Business Logic Layer — services.py]
        Service[SavedOpportunityService]
        Rules[Validate IDs, prevent duplicates, retrieve details]
        Service --> Rules
    end
    subgraph Persistence[Persistence Layer — repositories.py and database.py]
        SavedRepo[SavedOpportunityRepository]
        OppRepo[OpportunityRepository]
        SQLite[(SQLite: saved_opportunities and opportunities)]
        SavedRepo --> SQLite
        OppRepo --> SQLite
    end
    UI -.->|Frontend API wiring pending| GET
    UI -.->|Frontend API wiring pending| POST
    UI -.->|Frontend API wiring pending| DELETE
    GET --> Service
    POST --> Service
    DELETE --> Service
    Service --> SavedRepo
    Service --> OppRepo
```

## Implementation Notes

- The backend uses `DEMO_STUDENT_ID = "demo-student"` while authentication is outside the current MVP scope.
- Saving checks whether an opportunity exists and whether it has already been bookmarked.
- Listing retrieves the current opportunity data for each saved ID, skipping records whose opportunities are no longer present.
- Removing a nonexistent bookmark returns HTTP 404.
- The existing React Saved page still needs to call these endpoints for bookmarks to persist across refreshes.
- The implementation has not yet been runtime-tested or peer-reviewed; the diagrams describe the submitted backend code and intended frontend integration.
