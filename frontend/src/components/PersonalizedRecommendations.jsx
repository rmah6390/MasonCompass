import React, { useMemo, useState } from "react";
import "./PersonalizedRecommendations.css";

const CATEGORY_OPTIONS = ["Internships", "Research", "Scholarships"];

function CompassMark() {
  return (
    <svg className="mc-rec__compass" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2.4" />
      <path d="m23.8 10.2-3.9 10-9.7 4.5 4.3-10.5 9.3-4Z" fill="#b9d9a4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}

function BookmarkIcon({ saved }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function ArrowIcon({ direction = "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: direction === "down" ? "rotate(90deg)" : undefined }}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/**
 * Sanaa's integrable recommendation screen.
 * variant="team" (default): matches the team's recent panel 07 visual system.
 * variant="original": preserves Sanaa's older panel 03 stacked-card layout.
 *
 * Navigation is delegated to Ridha's shared application through callbacks.
 * Saved state may be controlled by the parent via savedIds/onToggleSave.
 */
export default function PersonalizedRecommendations({
  student = { firstName: "Alex" },
  opportunities = [],
  variant = "team",
  savedIds,
  onToggleSave,
  onHome = () => {},
  onRecommendations = () => {},
  onOpenSaved = () => {},
  onOpenProfile = () => {},
  onSelectOpportunity = () => {},
  onSelectCategory = () => {},
  onDiscover = () => {},
  showHeader = true,
}) {
  const [query, setQuery] = useState("");
  const [localSaved, setLocalSaved] = useState([]);
  const isOriginal = variant === "original";
  const activeSaved = savedIds ?? localSaved;
  const firstName = student.firstName || student.fullName?.split(" ")[0] || "Alex";
  const visibleOpportunities = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (isOriginal || !normalized) return opportunities;
    return opportunities.filter((opp) => [
      opp.title, opp.organization, opp.location, opp.fit, opp.fitReason,
      opp.description, ...(opp.skills || []),
    ].join(" ").toLowerCase().includes(normalized));
  }, [query, opportunities, isOriginal]);

  function handleSave(opportunity) {
    if (onToggleSave) {
      onToggleSave(opportunity);
    } else {
      setLocalSaved((previous) => previous.includes(opportunity.id)
        ? previous.filter((id) => id !== opportunity.id)
        : [...previous, opportunity.id]);
    }
  }

  return (
    <div className={`mc-rec ${isOriginal ? "mc-rec--original" : "mc-rec--team"}`}>
      {showHeader && <header className="mc-rec__topbar">
        <button type="button" className="mc-rec__brand" onClick={onDiscover} aria-label="MasonCompass Discover">
          <CompassMark /> <span>masoncompass</span>
        </button>
        <nav className="mc-rec__navigation" aria-label="Main navigation">
          <button type="button" className="mc-rec__nav-item" onClick={onHome}>Home</button>
          <button type="button" className="mc-rec__nav-item mc-rec__nav-item--selected" onClick={onRecommendations} aria-current="page">Recommendations</button>
          <button type="button" className="mc-rec__nav-item" onClick={onDiscover}>Discover</button>
          {!isOriginal && <button type="button" className="mc-rec__nav-item" onClick={onOpenSaved}>Saved{activeSaved.length > 0 ? ` (${activeSaved.length})` : ""}</button>}
          <button type="button" className="mc-rec__nav-item" onClick={onOpenProfile}>Profile</button>
          {!isOriginal && <button type="button" className="mc-rec__avatar" onClick={onOpenProfile} aria-label="Open profile">{firstName.slice(0, 1).toUpperCase()}M</button>}
        </nav>
      </header>}

      <main className="mc-rec__main">
        {!isOriginal && <div className="mc-rec__eyebrow">DISCOVER <span>/</span> PERSONALIZED OPPORTUNITIES</div>}
        <div className="mc-rec__heading-row">
          <div>
            <h1>Recommended for {firstName}</h1>
            <p className="mc-rec__subheading">Based on your major, skills, and interests <span aria-hidden="true">·</span> <button className="mc-rec__edit" type="button" onClick={onOpenProfile}>Edit profile</button></p>
          </div>
          {!isOriginal && <span className="mc-rec__discovery-badge"><span className="mc-rec__sparkle" aria-hidden="true">✧</span> PERSONALIZED DISCOVERY</span>}
        </div>

        {!isOriginal && (
          <section className="mc-rec__browse" aria-label="Browse opportunity types">
            <div className="mc-rec__section-label">FIND YOUR NEXT OPPORTUNITY</div>
            <div className="mc-rec__browse-tools">
              <div className="mc-rec__tabs" role="group" aria-label="Opportunity categories">
                {CATEGORY_OPTIONS.map((category) => (
                  <button key={category} className={`mc-rec__tab ${category === "Internships" ? "mc-rec__tab--active" : ""}`} type="button" aria-current={category === "Internships" ? "page" : undefined} onClick={() => onSelectCategory(category)}>{category}</button>
                ))}
              </div>
              <label className="mc-rec__search">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5"/></svg>
                <span className="mc-rec__sr-only">Search recommendations</span>
                <input type="search" placeholder="Search opportunities" value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
            </div>
          </section>
        )}

        {!isOriginal && <div className="mc-rec__results-title"><span className="mc-rec__results-mark" aria-hidden="true">✦</span> RECOMMENDED FOR YOU <span className="mc-rec__results-count">{visibleOpportunities.length} opportunities</span></div>}
        <section className="mc-rec__cards" aria-label="Your personalized recommendations">
          {visibleOpportunities.length === 0 && <div className="mc-rec__empty">{query ? `No recommendations match “${query}”. Try another search.` : "No matching opportunities were found for this profile."}</div>}
          {visibleOpportunities.map((item) => (
            isOriginal ? (
              <button type="button" key={item.id} className="mc-rec__original-card" onClick={() => onSelectOpportunity(item)} aria-label={`View details for ${item.title}`}>
                <span><strong>{item.title}</strong><small><b>{item.fit}</b> · {item.fitReason}</small></span><ArrowIcon />
              </button>
            ) : (
              <article className="mc-rec__card" key={item.id}>
                <div className="mc-rec__card-top">
                  <span className={`mc-rec__fit ${item.fit.toLowerCase().includes("strong") ? "mc-rec__fit--strong" : "mc-rec__fit--growth"}`}>{item.fit}</span>
                  <button type="button" className={`mc-rec__bookmark ${activeSaved.includes(item.id) ? "mc-rec__bookmark--saved" : ""}`} onClick={() => handleSave(item)} aria-label={`${activeSaved.includes(item.id) ? "Remove" : "Save"} ${item.title}`} aria-pressed={activeSaved.includes(item.id)}><BookmarkIcon saved={activeSaved.includes(item.id)} /></button>
                </div>
                <h2>{item.title}</h2>
                <p className="mc-rec__organization">{item.organization} <span aria-hidden="true">·</span> {item.location}</p>
                <p className="mc-rec__description">{item.fit.toLowerCase().includes("strong") ? "A strong match for your current profile." : "A chance to explore and grow your skills."}</p>
                <div className="mc-rec__match-line"><span className="mc-rec__match-dot" aria-hidden="true" /> <strong>{item.fit.toLowerCase().includes("strong") ? "Why it matches:" : "Skill to explore:"}</strong> {item.fitReason}</div>
                <div className="mc-rec__card-footer"><button type="button" className="mc-rec__details" onClick={() => onSelectOpportunity(item)}>View Details <ArrowIcon /></button><span className="mc-rec__detail-hint">Check full opportunity details</span></div>
              </article>
            )
          ))}
        </section>

        {isOriginal ? (
          <div className="mc-rec__category-buttons" role="group" aria-label="Explore opportunities">
            {CATEGORY_OPTIONS.map((category, index) => <button type="button" key={category} className={`mc-rec__category-button ${index === 0 ? "mc-rec__category-button--primary" : ""}`} onClick={() => onSelectCategory(category)}>{category} <ArrowIcon direction="down" /></button>)}
          </div>
        ) : (
          <p className="mc-rec__disclaimer">Recommendations are ranked using a stored demo profile and sample opportunities. Always review eligibility and deadlines on the original listing.</p>
        )}
      </main>
    </div>
  );
}
