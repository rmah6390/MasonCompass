import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api";
import "./StudentProfile.css";

function toFormProfile(profile) {
  return {
    name: profile.fullName || "",
    major: profile.major || "",
    year: profile.year || "",
    interests: (profile.interests || []).join(", "),
    skills: (profile.skills || []).join(", "),
    careerGoal: profile.careerGoal || ""
  };
}

function StudentProfile() {
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [careerGoal, setCareerGoal] = useState("");

  const [savedProfile, setSavedProfile] = useState(null);
  const [editing, setEditing] = useState(true);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        const profile = toFormProfile(data);
        setName(profile.name);
        setMajor(profile.major);
        setYear(profile.year);
        setInterests(profile.interests);
        setSkills(profile.skills);
        setCareerGoal(profile.careerGoal);
        setSavedProfile(profile);
        setEditing(false);
      })
      .catch(() => {
        if (active) setMessage("Please refresh the page. The profile could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (saving || loading) return;
    if (!name.trim() || !major || !year) {
      setMessage("Please enter your name, major, and academic year.");
      return;
    }

    const profile = {
      fullName: name.trim(),
      major,
      year,
      interests: interests.split(",").map((item) => item.trim()).filter(Boolean),
      skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
      careerGoal: careerGoal.trim()
    };
    setSaving(true);
    setMessage("");
    try {
      const updated = toFormProfile(await updateProfile(profile));
      setName(updated.name);
      setMajor(updated.major);
      setYear(updated.year);
      setInterests(updated.interests);
      setSkills(updated.skills);
      setCareerGoal(updated.careerGoal);
      setSavedProfile(updated);
      setEditing(false);
      setMessage(savedProfile ? "Profile updated successfully!" : "Profile saved successfully!");
    } catch (error) {
      setMessage("Please try again. " + (error.message || "The profile could not be saved."));
    } finally {
      setSaving(false);
    }
  }

  function handleEdit() {
    setEditing(true);
    setMessage("");
  }

  function handleCancel() {
    if (savedProfile) {
      setName(savedProfile.name);
      setMajor(savedProfile.major);
      setYear(savedProfile.year);
      setInterests(savedProfile.interests);
      setSkills(savedProfile.skills);
      setCareerGoal(savedProfile.careerGoal);
      setEditing(false);
    }
    setMessage("");
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>MasonCompass</h1>
        <p>Student Profile & Preferences</p>
      </header>

      <main className="profile-container">
        {message && (
          <p className={
            message.startsWith("Please")
              ? "profile-message error"
              : "profile-message success"
          }>
            {message}
          </p>
        )}

        {loading ? (<p role="status">Loading profile...</p>) : editing ? (
          <form onSubmit={handleSave} className="profile-card">
            <h2>
              {savedProfile ? "Edit Profile" : "Create Your Profile"}
            </h2>

            <p className="profile-subtitle">
              Tell us about yourself to help discover
              opportunities that match your interests.
            </p>

            <label htmlFor="student-name">Full Name</label>
            <input
              id="student-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="student-major">Major</label>
            <select
              id="student-major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            >
              <option value="">Select your major</option>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Cybersecurity</option>
              <option>Business</option>
              <option>Engineering</option>
              <option>Biology</option>
              <option>Other</option>
            </select>

            <label htmlFor="academic-year">Academic Year</label>
            <select
              id="academic-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select academic year</option>
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Graduate Student</option>
            </select>

            <label htmlFor="student-interests">Interests</label>
            <input
              id="student-interests"
              type="text"
              placeholder="Software Development, Cybersecurity"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />

            <label htmlFor="student-skills">Skills</label>
            <input
              id="student-skills"
              type="text"
              placeholder="Python, Java, SQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <label htmlFor="career-goal">Career Goals</label>
            <textarea
              id="career-goal"
              placeholder="Example: Become a Software Engineer"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              rows="3"
            />

            <div className="profile-buttons">
              <button type="submit" className="save-button" disabled={saving}>
                {saving ? "Saving..." : savedProfile ? "Save Changes" : "Save Profile"}
              </button>

              {savedProfile && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <section className="profile-card">
            <h2>My Student Profile</h2>
            <p className="profile-subtitle">
              Your saved academic information and preferences.
            </p>

            <div className="profile-info">
              <p><strong>Full Name:</strong> {savedProfile.name}</p>
              <p><strong>Major:</strong> {savedProfile.major}</p>
              <p><strong>Academic Year:</strong> {savedProfile.year}</p>
              <p><strong>Interests:</strong> {savedProfile.interests || "Not provided"}</p>
              <p><strong>Skills:</strong> {savedProfile.skills || "Not provided"}</p>
              <p><strong>Career Goals:</strong> {savedProfile.careerGoal || "Not provided"}</p>
            </div>

            <button className="save-button" onClick={handleEdit}>
              Edit Profile
            </button>

            <div className="recommendation-note">
              <h3>Personalization Ready</h3>
              <p>
                Your profile information can be used to provide
                personalized opportunity recommendations.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default StudentProfile;
