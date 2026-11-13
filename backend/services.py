import re
from fastapi import HTTPException

def normalize(value):
    return str(value or "").strip().casefold()

def terms(values):
    if isinstance(values, str):
        values = re.split(r"[,;]", values)
    return {normalize(value) for value in (values or []) if normalize(value)}

class ProfileService:
    """Validate and save student profiles through the repository."""
    def __init__(self, profiles):
        self.profiles = profiles

    def get_profile(self, student_id):
        return self.profiles.get(student_id)

    def validate_profile(self, profile):
        if not isinstance(profile, dict):
            raise ValueError("Profile must be an object.")

        cleaned = {}
        for field in ("fullName", "major", "year"):
            value = profile.get(field)
            if not isinstance(value, str) or not value.strip():
                raise ValueError(f"{field} is required.")
            cleaned[field] = value.strip()

        cleaned["firstName"] = cleaned["fullName"].split()[0]

        for field in ("skills", "interests"):
            values = profile.get(field, [])
            if not isinstance(values, list) or any(not isinstance(value, str) for value in values):
                raise ValueError(f"{field} must be a list of strings.")
            cleaned[field] = list(dict.fromkeys(value.strip() for value in values if value.strip()))

        career_goal = profile.get("careerGoal", "")
        if not isinstance(career_goal, str):
            raise ValueError("careerGoal must be a string.")
        cleaned["careerGoal"] = career_goal.strip()
        return cleaned

    def save_profile(self, student_id, profile):
        cleaned = self.validate_profile(profile)
        return self.profiles.save(student_id, cleaned)

class RecommendationService:
    """Rule-based ranking, independent of the UI and database implementation."""
    def __init__(self, profiles, opportunities):
        self.profiles = profiles
        self.opportunities = opportunities

    def recommend(self, student_id):
        profile = self.profiles.get(student_id)
        if profile is None:
            return None
        major = normalize(profile.get("major"))
        student_skills = terms(profile.get("skills"))
        interests = terms(profile.get("interests"))
        results = []
        for item in self.opportunities.list_all():
            opportunity_major = normalize(item.get("major"))
            major_match = bool(major and opportunity_major == major)
            required = terms(item.get("skills"))
            matched = student_skills & required
            missing = required - student_skills
            text = " ".join(normalize(item.get(field)) for field in
                            ("title", "description", "category"))
            interest_matches = sorted(interest for interest in interests if interest in text)
            score = (40 if major_match else 0) + 30 * len(matched) / max(1, len(required)) + 10 * len(interest_matches)
            # Do not interpret sample major labels as strict eligibility.
            if score == 0:
                continue
            reasons = []
            if major_match:
                reasons.append(profile["major"])
            if matched:
                reasons.append(", ".join(sorted(matched)))
            if interest_matches:
                reasons.append(", ".join(interest_matches))
            strong = major_match and bool(matched) and not missing
            if missing and not strong:
                reasons.append("Explore " + ", ".join(sorted(missing)))
            results.append({**item, "score": round(score, 2),
                            "fit": "Strong fit" if strong else "Skill gap to explore",
                            "fitReason": " · ".join(reasons)})
        return sorted(results, key=lambda item: (-item["score"], item["title"]))


class OpportunityService:
    def __init__(self, repository):
        self.repository = repository

    def get_details(self, opportunity_id):
        opportunity_id = opportunity_id.strip()
        if not opportunity_id:
            raise HTTPException(status_code=400, detail="Opportunity ID is required.")

        opportunity = self.repository.get(opportunity_id)
        if opportunity is None:
            raise HTTPException(status_code=404, detail="Opportunity not found.")

        return {
            **opportunity,
            "requirements": opportunity.get("requirements") or [],
            "official_url": opportunity.get("official_url") or opportunity.get("officialUrl"),
            "is_sample": opportunity.get("is_sample", opportunity.get("isSample", True)),
        }


# SearchFilterService for searching and filtering opportunities
class SearchFilterService:
    def __init__(self, repository):
        self.repository = repository

    def search(self, keyword="", category="", major="", location=""):
        opportunities = self.repository.list_all()
        results = []

        category_aliases = {
            "internships": "internship",
            "scholarships": "scholarship",
        }

        for opportunity in opportunities:
            title = normalize(opportunity.get("title"))
            description = normalize(opportunity.get("description"))

            if keyword:
                search_text = normalize(keyword)
                if search_text not in title and search_text not in description:
                    continue

            if category and normalize(category) not in ("all", "all categories"):
                selected = normalize(category)
                actual = normalize(opportunity.get("category"))

                selected = category_aliases.get(selected, selected)
                actual = category_aliases.get(actual, actual)

                if selected != actual:
                    continue

            if major and normalize(major) not in ("all", "all majors"):
                if normalize(major) != normalize(opportunity.get("major")):
                    continue

            if location and normalize(location) not in ("all", "any location"):
                if normalize(location) not in normalize(opportunity.get("location")):
                    continue

            results.append(opportunity)

        return results
