from sqlalchemy import select
from database import StudentProfile, Opportunity

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
