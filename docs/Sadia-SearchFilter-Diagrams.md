
# Search & Filtering — Design Diagrams

**Project:** MasonCompass  
**Deliverable:** 4  
**Feature:** Opportunity Search & Filtering  
**Contributor:** Sadia

## 1. Conceptual Class Diagram

This diagram shows the main concepts involved in searching for opportunities.

```mermaid
classDiagram
    class Student {
        Student ID
        Major
    }

    class SearchFilters {
        Keyword
        Category
        Major
        Location
    }

    class Opportunity {
        Opportunity ID
        Title
        Description
        Category
        Major
        Location
    }

    Student --> SearchFilters : selects
    SearchFilters --> Opportunity : finds matches
```

## 2. Detailed Class Diagram

This diagram shows the components and classes used to implement the feature.

```mermaid
classDiagram
    class OpportunitySearch {
        filters
        opportunities
        loading
        error
        handleCategoryChange()
        handleClear()
    }

    class OpportunityFilters {
        filters
        onFilterChange
        onCategoryChange
        onClear
    }

    class SearchFilterService {
        repository
        search(keyword, category, major, location)
    }

    class OpportunityRepository {
        session
        list_all()
        get(opportunity_id)
    }

    class Opportunity {
        id
        data
    }

    OpportunitySearch --> OpportunityFilters : renders
    OpportunitySearch ..> SearchFilterService : uses API
    SearchFilterService --> OpportunityRepository : calls
    OpportunityRepository --> Opportunity : retrieves
```

## 3. Sequence Diagram

This diagram shows what happens when a student searches for an opportunity.

```mermaid
sequenceDiagram
    actor Student
    participant UI as React Frontend
    participant API as FastAPI
    participant Service as SearchFilterService
    participant Repo as OpportunityRepository
    participant DB as Database

    Student->>UI: Enter keyword and filters
    UI->>API: GET /api/opportunities
    API->>Service: search(filters)
    Service->>Repo: list_all()
    Repo->>DB: Retrieve opportunities
    DB-->>Repo: Opportunity records
    Repo-->>Service: Opportunity list
    Service->>Service: Apply filters
    Service-->>API: Matching opportunities
    API-->>UI: JSON response
    UI-->>Student: Display results
```

## 4. Layered Architecture Diagram

This diagram shows how the different parts of the feature work together.

```mermaid
flowchart TD
    A["Presentation Layer<br/>OpportunitySearch.jsx<br/>OpportunityFilters.jsx"]
    B["API Layer<br/>main.py<br/>GET /api/opportunities"]
    C["Business Logic Layer<br/>services.py<br/>SearchFilterService"]
    D["Data Access Layer<br/>repositories.py<br/>OpportunityRepository"]
    E[("Database Layer<br/>SQLAlchemy<br/>Opportunity Records")]

    A --> B
    B --> C
    C --> D
    D --> E
```

## Design Summary

The Search & Filtering feature follows a layered design.

The React frontend collects the student's search keyword and filter selections. FastAPI receives the request and passes the information to SearchFilterService.

SearchFilterService uses OpportunityRepository to retrieve opportunities from the database and returns the matching results.

This separation makes the feature easier to maintain and test.

## Review Status

Reviewed by Trey Irizarry

approved
