import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import OpportunityDetails from "./components/OpportunityDetails";
import PersonalizedRecommendations from "./components/PersonalizedRecommendations";
import TajOpportunityDiscovery from "./components/TajOpportunityDiscovery";
import StudentProfile from "./components/StudentProfile";
import { recommendations } from "./components/opportunities";
import { tajAdaptedOpportunities } from "./components/tajOpportunities";
import "./App.css";
import { getProfile, getRecommendations } from "./api";

const allOpportunities = [...recommendations, ...tajAdaptedOpportunities];
const categoryNames = {
  internships: "Internships",
  research: "Research",
  scholarships: "Scholarships",
};

function Home() {
  const navigate = useNavigate();

  return (
    <main className="mc-home">
      <section className="mc-home__hero">
        <span className="mc-home__eyebrow">WELCOME TO MASONCOMPASS</span>
        <h1>Find your next opportunity at Mason</h1>
        <p>Discover internships, research opportunities, and scholarships that support your goals at George Mason University.</p>
        <div className="mc-home__actions">
          <button type="button" className="mc-home__button" onClick={() => navigate("/discover")}>Explore Opportunities →</button>
          <button type="button" className="mc-home__button mc-home__button--secondary" onClick={() => navigate("/recommendations")}>View Recommendations</button>
        </div>
      </section>
      <section className="mc-home__categories" aria-label="Opportunity categories">
        <h2>Explore your options</h2>
        <div className="mc-home__grid">
          <button type="button" className="mc-home__category" onClick={() => navigate("/discover/internships")}>
            <span className="mc-home__category-label">INTERNSHIPS</span>
            <strong>Build your experience</strong>
            <span>Explore opportunities to apply your skills in the workplace.</span>
            <span className="mc-home__category-arrow">Explore internships →</span>
          </button>
          <button type="button" className="mc-home__category" onClick={() => navigate("/discover/research")}>
            <span className="mc-home__category-label">RESEARCH</span>
            <strong>Discover new ideas</strong>
            <span>Find projects where you can learn and contribute.</span>
            <span className="mc-home__category-arrow">Explore research →</span>
          </button>
          <button type="button" className="mc-home__category" onClick={() => navigate("/discover/scholarships")}>
            <span className="mc-home__category-label">SCHOLARSHIPS</span>
            <strong>Support your education</strong>
            <span>Browse scholarship opportunities for students.</span>
            <span className="mc-home__category-arrow">Explore scholarships →</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function AppPages() {
  const navigate = useNavigate();
  const location = useLocation();
  const [detailsReturnPath, setDetailsReturnPath] = useState("/discover");
  const [savedIds, setSavedIds] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [recommendationStatus, setRecommendationStatus] = useState("loading");

  useEffect(() => {
    if (location.pathname !== "/recommendations") return;
    let active = true;
    setRecommendationStatus("loading");
    Promise.all([getProfile(), getRecommendations()])
      .then(([profile, opportunities]) => {
        if (!active) return;
        setRecommendationData({ profile, opportunities });
        setRecommendationStatus("ready");
      })
      .catch(() => { if (active) setRecommendationStatus("error"); });
    return () => { active = false; };
  }, [location.pathname]);


  function toggleSave(opportunity) {
    setSavedIds((previous) => previous.includes(opportunity.id)
      ? previous.filter((id) => id !== opportunity.id)
      : [...previous, opportunity.id]);
  }

  function openOpportunity(opportunity) {
    setDetailsReturnPath(location.pathname);
    setSelectedOpportunity(opportunity);
    navigate("/details");
  }

  function RecommendationsPage() {
    if (recommendationStatus === "loading") return <main className="mc-home"><p>Loading recommendations...</p></main>;
    if (recommendationStatus === "error") return <main className="mc-home"><p role="alert">Cannot load recommendations. Start the API on port 8000 and refresh.</p><button onClick={() => navigate("/")}>Home</button></main>;
    return (
      <PersonalizedRecommendations
        student={recommendationData.profile}
        opportunities={recommendationData.opportunities}
        savedIds={savedIds}
        onToggleSave={toggleSave}
        onSelectOpportunity={openOpportunity}
        onHome={() => navigate("/")}
        onRecommendations={() => navigate("/recommendations")}
        onOpenProfile={() => navigate("/profile")}
        onOpenSaved={() => navigate("/saved")}
        onDiscover={() => navigate("/discover")}
        onSelectCategory={(category) => navigate(`/discover/${category.toLowerCase()}`)}
      />
    );
  }

  function SavedPage() {
    const savedOpportunities = Array.from(
      new Map(allOpportunities.filter((item) => savedIds.includes(item.id)).map((item) => [item.id, item])).values()
    );

    return (
      <main className="mc-saved" style={{ background: "#f6f8f5", color: "#173c2a", minHeight: "100vh", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h1 style={{ color: "#173c2a", marginBottom: 8 }}>Saved Opportunities</h1>
          <p style={{ color: "#526c5d", marginBottom: 28 }}>Review the opportunities you have bookmarked.</p>
          {savedOpportunities.length === 0 ? (
            <div style={{ background: "white", border: "1px solid #dae5dc", borderRadius: 10, padding: 24 }}>
              <p>You haven't saved any opportunities yet.</p>
              <button className="mc-saved__button" type="button" onClick={() => navigate("/discover")}>Explore Opportunities</button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {savedOpportunities.map((item) => (
                <article key={item.id} style={{ background: "white", border: "1px solid #dae5dc", borderRadius: 10, padding: 22 }}>
                  <h2 style={{ color: "#173c2a", margin: "0 0 8px" }}>{item.title}</h2>
                  <p style={{ color: "#526c5d", margin: "0 0 12px" }}>{item.organization || "Organization not specified"}</p>
                  {item.description && <p>{item.description}</p>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
                    <button className="mc-saved__button" type="button" onClick={() => openOpportunity(item)}>View Details</button>
                    <button className="mc-saved__button mc-saved__button--secondary" type="button" onClick={() => toggleSave(item)}>Remove Saved</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  function DiscoveryPage() {
    const { category: categorySlug = "internships" } = useParams();
    const category = categoryNames[categorySlug] || "Internships";
    return (
      <div className="discovery-shell">
        <TajOpportunityDiscovery
          category={category}
          opportunities={allOpportunities}
          onNavigate={navigate}
          onSelectOpportunity={openOpportunity}
          savedIds={savedIds}
          onToggleSave={toggleSave}
        />
      </div>
    );
  }

  return (
    <>
      {location.pathname !== "/recommendations" && (
      <nav className="mc-app-nav" aria-label="Main navigation">
        <NavLink className="mc-app-nav__brand" to="/">◈ <span>masoncompass</span></NavLink>
        <div className="mc-app-nav__links">
          <NavLink to="/" end className={({ isActive }) => `mc-app-nav__link${isActive ? " mc-app-nav__link--active" : ""}`}>Home</NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => `mc-app-nav__link${isActive ? " mc-app-nav__link--active" : ""}`}>Recommendations</NavLink>
          <NavLink to="/discover" className={({ isActive }) => `mc-app-nav__link${isActive ? " mc-app-nav__link--active" : ""}`}>Discover</NavLink>
          <NavLink to="/saved" className={({ isActive }) => `mc-app-nav__link${isActive ? " mc-app-nav__link--active" : ""}`}>Saved</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `mc-app-nav__link${isActive ? " mc-app-nav__link--active" : ""}`}>Profile</NavLink>
        </div>
      </nav>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/discover" element={<DiscoveryPage />} />
        <Route path="/discover/:category" element={<DiscoveryPage />} />
        <Route
          path="/details"
          element={<OpportunityDetails opportunity={selectedOpportunity} returnTo={detailsReturnPath} />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppPages />
    </BrowserRouter>
  );
}

export default App;
