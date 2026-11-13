
# MasonCompass | Internship Opportunity Discovery

**CS 321 – Deliverable 04**  
**Author:** Trey Irizarry  
**Feature:** Internship Opportunity Discovery

---

## 1. Conceptual Class Diagram

```mermaid
classDiagram
    direction LR

    class Opportunity {
        +String id
        +String title
        +String category
        +String organization
        +String description
        +List requirements
        +String deadline
        +String location
        +String major
        +String official_url
    }

    class Student {
        +String id
        +String name
        +String major
    }

    Student "0..*" --> "0..*" Opportunity : views

    style Student fill:#006633,stroke:#FFCC33,color:#FFFFFF,stroke-width:2px
    style Opportunity fill:#FFCC33,stroke:#006633,color:#172B20,stroke-width:2px
```

---

## 2. Detailed Class Diagram

```mermaid
classDiagram
    direction TB

    class OpportunityDetails {
        +opportunity
        +returnTo: string
        +loading: boolean
        +error: string
        +opportunityId: string
    }

    class OpportunityServiceFrontend {
        +getOpportunityDetails(opportunityId)
    }

    class FastAPI {
        +get_opportunity_details(opportunity_id: str)
    }

    class OpportunityService {
        +repository: OpportunityRepository
        +get_details(opportunity_id: str) dict
    }

    class OpportunityRepository {
        +session: Session
        +get(opportunity_id: str) dict
        +list_all() list
    }

    class Opportunity {
        +id: str
        +data: dict
    }

    OpportunityDetails --> OpportunityServiceFrontend : requests details
    OpportunityServiceFrontend --> FastAPI : HTTP GET
    FastAPI --> OpportunityService : invokes
    OpportunityService --> OpportunityRepository : retrieves
    OpportunityRepository --> Opportunity : reads

    style OpportunityDetails fill:#006633,stroke:#FFCC33,color:#FFFFFF,stroke-width:2px
    style OpportunityServiceFrontend fill:#006633,stroke:#FFCC33,color:#FFFFFF,stroke-width:2px
    style FastAPI fill:#FFCC33,stroke:#006633,color:#172B20,stroke-width:2px
    style OpportunityService fill:#FFCC33,stroke:#006633,color:#172B20,stroke-width:2px
    style OpportunityRepository fill:#1D4ED8,stroke:#93C5FD,color:#FFFFFF,stroke-width:2px
    style Opportunity fill:#1D4ED8,stroke:#93C5FD,color:#FFFFFF,stroke-width:2px
```

---

## 3. Sequence Diagram

```mermaid
sequenceDiagram
    autonumber

    actor Student
    participant UI as OpportunityDetails.jsx
    participant FS as opportunityService.js
    participant API as FastAPI
    participant BS as OpportunityService
    participant Repo as OpportunityRepository
    participant DB as Database

    Student->>UI: Select an opportunity
    UI->>FS: getOpportunityDetails(opportunityId)
    FS->>API: GET /api/opportunities/{opportunity_id}
    API->>BS: get_details(opportunity_id)
    BS->>BS: Validate opportunity ID

    BS->>Repo: get(opportunity_id)
    Repo->>DB: Query opportunity by ID
    DB-->>Repo: Opportunity record
    Repo-->>BS: Opportunity data or None

    alt Opportunity found
        BS->>BS: Normalize requirements and posting URL
        BS-->>API: Formatted opportunity details
        API-->>FS: 200 OK - JSON response
        FS-->>UI: Opportunity data
        UI-->>Student: Display opportunity details

    else Opportunity not found
        BS-->>API: HTTP 404 error
        API-->>FS: 404 Not Found
        FS-->>UI: Error message
        UI-->>Student: Show error and available sample data
    end
```

---

## 4. Layered Architecture Diagram

```mermaid
flowchart TD

    subgraph UI["01 | User Interface Layer"]
        direction TB
        A["Student"]
        B["OpportunityDetails.jsx<br/>React Component"]
        C["opportunityService.js<br/>API Client"]

        A -->|"Select opportunity"| B
        B -->|"Request details"| C
    end

    subgraph APP["02 | Application Layer"]
        direction TB
        D["FastAPI Endpoint<br/>main.py"]
        E["OpportunityService<br/>services.py"]

        D -->|"get_details()"| E
    end

    subgraph DATA["03 | Persistence Layer"]
        direction TB
        F["OpportunityRepository<br/>repositories.py"]
        G["Opportunity Model<br/>database.py"]
        H[("SQLite Database")]

        F -->|"Query by ID"| G
        G --> H
    end

    C -->|"HTTP GET / JSON"| D
    E -->|"get(opportunity_id)"| F

    classDef uiNode fill:#006633,stroke:#FFCC33,color:#FFFFFF,stroke-width:2px
    classDef appNode fill:#FFCC33,stroke:#006633,color:#172B20,stroke-width:2px
    classDef dataNode fill:#1D4ED8,stroke:#93C5FD,color:#FFFFFF,stroke-width:2px

    class A,B,C uiNode
    class D,E appNode
    class F,G,H dataNode

    style UI fill:#E8F5E9,stroke:#006633,stroke-width:2px,color:#006633
    style APP fill:#FFF8DB,stroke:#E5B82E,stroke-width:2px,color:#172B20
    style DATA fill:#E8F0FE,stroke:#1D4ED8,stroke-width:2px,color:#1D4ED8
```

---
