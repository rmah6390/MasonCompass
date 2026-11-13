from sqlalchemy import select
from database import StudentProfile, Opportunity, SavedOpportunity

class ProfileRepository:
    def __init__(self, session):
        self.session = session

    def get(self, student_id):
        row = self.session.get(StudentProfile, student_id)
        return row.data if row else None

    def save(self, student_id, profile):
        row = self.session.get(StudentProfile, student_id)
        if row is None:
            row = StudentProfile(id=student_id, data=profile)
            self.session.add(row)
        else:
            row.data = profile
        self.session.commit()
        return row.data

class OpportunityRepository:
    def __init__(self, session):
        self.session = session

    def list_all(self):
        return [row.data for row in self.session.scalars(select(Opportunity)).all()]

    def get(self, opportunity_id):
        row = self.session.get(Opportunity, opportunity_id)
        return row.data if row else None


# Taj's repository
class SavedOpportunityRepository:
    def __init__(self, session):
        self.session = session

    def list_by_student(self, student_id):
        statement = select(SavedOpportunity).where(
            SavedOpportunity.student_id == student_id
        )
        return self.session.scalars(statement).all()

    def get_by_student_and_opportunity(self, student_id, opportunity_id):
        statement = select(SavedOpportunity).where(
            SavedOpportunity.student_id == student_id,
            SavedOpportunity.opportunity_id == opportunity_id
        )
        return self.session.scalars(statement).first()

    def save(self, student_id, opportunity_id):
        existing = self.get_by_student_and_opportunity(
            student_id, opportunity_id
        )

        if existing:
            return existing

        saved = SavedOpportunity(
            id=f"{student_id}:{opportunity_id}",
            student_id=student_id,
            opportunity_id=opportunity_id
        )

        self.session.add(saved)
        self.session.commit()
        return saved

    def remove(self, student_id, opportunity_id):
        saved = self.get_by_student_and_opportunity(
            student_id, opportunity_id
        )

        if saved is None:
            return False

        self.session.delete(saved)
        self.session.commit()
        return True
