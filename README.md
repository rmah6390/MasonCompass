# MasonCompass

**A Personalized Student Resource and Opportunity Discovery Platform for George Mason University**

MasonCompass is a proposed web-based platform designed to help George Mason University students discover, organize, and access academic, professional, and extracurricular opportunities in one centralized location.

## Project Overview

George Mason University offers numerous resources through platforms such as Handshake, Mason360, university departments, student organizations, and academic programs. However, these resources are distributed across multiple independent systems, requiring students to navigate different websites and services to find relevant opportunities.

MasonCompass aims to address this challenge by providing a centralized platform where students can discover internships, research positions, scholarships, campus events, student organizations, and academic resources.

The platform will also support personalized opportunity recommendations based on students' academic backgrounds, interests, skills, and career goals.

## Core Features

### 1. Personalized Opportunity Discovery
- Centralized dashboard for academic and career opportunities.
- Personalized recommendations based on student profiles.
- Discovery of internships, scholarships, research positions, and campus events.
- Links to original university resources and application platforms.

### 2. Opportunity Search & Filtering
- Keyword-based opportunity searching.
- Filters for categories, majors, interests, and deadlines.
- Detailed opportunity descriptions and requirements.
- Direct links to original application and registration pages.

### 3. Eligibility Checker & Pathway Planner
- Compare student qualifications with opportunity requirements.
- Identify missing eligibility requirements.
- Suggest potential steps toward becoming eligible.
- Help students connect academic progress with future opportunities.

### 4. Saved Opportunities & Deadline Tracking
- Save opportunities for future reference.
- Organize bookmarked internships, scholarships, and events.
- View important application deadlines.
- Track upcoming opportunities through a centralized interface.

## Proposed System Architecture

MasonCompass follows a three-tier architectural approach separating the user interface, application logic, and database.

| Layer | Proposed Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Recommendation System | Python-based rule matching |
| Authentication | GMU SSO, subject to authorization |
| Version Control | Git and GitHub |
| Project Management | GitHub Projects |

The initial prototype will use sample or curated opportunity data. Integration with external GMU systems will depend on available APIs and necessary permissions.

## Development Methodology

Our team plans to use Agile development practices, incorporating:

- **Feature-Driven Development (FDD):** Organizing requirements around features that provide direct value to students.
- **Extreme Programming (XP):** Translating user stories into development functionalities and incorporating testing.
- **Scrum:** Organizing implementation into two-week development sprints.

### Planned Sprint Schedule

| Sprint | Dates | Focus |
|---|---|---|
| Sprint 1 | Oct. 20 – Nov. 2, 2026 | Dashboard, student profiles, search and filtering |
| Sprint 2 | Nov. 3 – Nov. 16, 2026 | Personalized recommendations |
| Sprint 3 | Nov. 17 – Nov. 30, 2026 | Eligibility checking and pathway planning |
| Sprint 4 | Dec. 1 – Dec. 14, 2026 | Saved opportunities, deadline tracking, and integration testing |

**Total estimated team effort:** 95 hours, including planning, development, coordination, and testing.

## GitHub Project Management

Our development backlog is organized using GitHub Issues and GitHub Projects.

- **Features:** Parent issues representing major user-facing capabilities.
- **User Stories:** Sub-issues describing specific student needs.
- **Development Functionalities:** Implementation tasks and testing requirements.
- **Sprint Planning:** Two-week iterations with assigned responsibilities and estimated effort.
- **Progress Tracking:** Todo, In Progress, and Done.

**[View MasonCompass Scrum Development Project](https://github.com/users/rmah6390/projects/4/views/4)**

## Development Team

| Team Member | Project Responsibilities |
|---|---|
| Ridha Mahmood | Team Leader, Backend Development & Recommendations |
| Sanaa Karkera | Scrum Project Management, Search & Filtering |
| Sadia Mou | Student Profiles, Saved Opportunities & Testing |
| Taj Dhaliwal | Database, Eligibility Checking & Pathway Planning |
| Trey Irizarry | Frontend Development & Dashboard Interface |

## Project Status

**Current Stage:** Requirements Engineering and MVP Planning

This repository contains the initial project requirements, user stories, feature backlog, development tasks, and Scrum sprint plan.

The implementation described in this README represents planned functionality. Features will be developed and tested incrementally throughout the project.

## Academic Information

**Course:** CS 321 – Software Engineering  
**Institution:** George Mason University  
**Semester:** Fall 2026  
**Instructor:** Dr. David I. Sumudio

---

*MasonCompass - Helping GMU students discover opportunities and navigate their academic and professional goals.*
