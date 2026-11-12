import unittest
from services import RecommendationService, ProfileService

class Profiles:
    def get(self, student_id):
        return {"major": "Computer Science", "skills": ["Python"], "interests": ["AI"]}

class Opportunities:
    def list_all(self):
        return [
            {"id": "a", "title": "Python internship", "major": "Computer Science", "skills": ["Python"]},
            {"id": "b", "title": "AI internship", "major": "Computer Science", "skills": ["Python", "PyTorch"]},
            {"id": "c", "title": "Accounting", "major": "Business", "skills": ["Accounting"]},
        ]

class RecommendationTests(unittest.TestCase):
    def test_rank_and_exclude_unmatched(self):
        results = RecommendationService(Profiles(), Opportunities()).recommend("demo")
        self.assertEqual([item["id"] for item in results], ["a", "b"])
        self.assertEqual(results[0]["fit"], "Strong fit")
        self.assertIn("pytorch", results[1]["fitReason"])


# EditableProfiles and ProfileTests as requested
class EditableProfiles:
    def __init__(self):
        self.data = {}

    def get(self, student_id):
        return self.data.get(student_id)

    def save(self, student_id, profile):
        self.data[student_id] = profile
        return profile


class ProfileTests(unittest.TestCase):
    def setUp(self):
        self.repository = EditableProfiles()
        self.service = ProfileService(self.repository)
        self.profile = {
            "fullName": " Alex Morgan ",
            "major": "Computer Science",
            "year": "Junior",
            "skills": ["Python", " Python ", "Java", ""],
            "interests": ["AI", "AI"],
            "careerGoal": " Software Engineer "
        }

    def test_save_and_retrieve_profile(self):
        saved = self.service.save_profile("demo", self.profile)
        self.assertEqual(saved["fullName"], "Alex Morgan")
        self.assertEqual(saved["firstName"], "Alex")
        self.assertEqual(saved["skills"], ["Python", "Java"])
        self.assertEqual(saved["interests"], ["AI"])
        self.assertEqual(saved["careerGoal"], "Software Engineer")
        self.assertEqual(self.service.get_profile("demo"), saved)

    def test_update_existing_profile(self):
        self.service.save_profile("demo", self.profile)
        updated = dict(self.profile, major="Business")
        self.service.save_profile("demo", updated)
        self.assertEqual(self.service.get_profile("demo")["major"], "Business")

    def test_missing_required_fields(self):
        for field in ("fullName", "major", "year"):
            with self.subTest(field=field):
                invalid = dict(self.profile, **{field: " "})
                with self.assertRaises(ValueError):
                    self.service.save_profile("demo", invalid)
        self.assertIsNone(self.service.get_profile("demo"))

    def test_invalid_skills_and_interests(self):
        for field in ("skills", "interests"):
            for value in ("Python", [123]):
                with self.subTest(field=field, value=value):
                    invalid = dict(self.profile, **{field: value})
                    with self.assertRaises(ValueError):
                        self.service.save_profile("demo", invalid)

    def test_profile_changes_affect_recommendations(self):
        self.service.save_profile("demo", self.profile)
        recommendations = RecommendationService(self.repository, Opportunities())
        self.assertEqual([item["id"] for item in recommendations.recommend("demo")], ["a", "b"])
        updated = dict(self.profile, major="Business", skills=["Accounting"], interests=[])
        self.service.save_profile("demo", updated)
        self.assertEqual([item["id"] for item in recommendations.recommend("demo")], ["c"])

if __name__ == "__main__":
    unittest.main()
