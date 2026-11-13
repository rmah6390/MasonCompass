import React, { useEffect, useState } from "react";
import OpportunityFilters from "./OpportunityFilters.jsx";
import OpportunityCard from "./OpportunityCard.jsx";
import "./TajOpportunityDiscovery.css";

const initialFilters = (category) => ({ category, search: "", major: "All", location: "All" });

/**
 * Taj's discovery + filtering interface. The parent app owns category routes,
 * shared opportunity IDs, bookmarks, and Details navigation.
 */
export default function TajOpportunityDiscovery({
  category,
  opportunities = [],
  onNavigate,
  onSelectOpportunity,
  savedIds = [],
  onToggleSave = () => {},
}) {
  const [filters, setFilters] = useState(() => initialFilters(category));
  useEffect(() => setFilters((previous) => ({ ...previous, category })), [category]);

  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const params = new URLSearchParams({
      keyword: filters.search,
      category,
      major: filters.major,
      location: filters.location,
    });

    async function loadOpportunities() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/opportunities?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load opportunities.");
        const data = await response.json();
        if (!controller.signal.aborted) {
          setFilteredOpportunities(data.map((item) => ({
            ...opportunities.find((existing) => existing.id === item.id),
            ...item,
          })));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
          setFilteredOpportunities([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadOpportunities();
    return () => controller.abort();
  }, [category, filters, opportunities]);

  const changeCategory = (nextCategory) => {
    if (nextCategory !== category) {
      setFilters(initialFilters(nextCategory));
      onNavigate(`/discover/${nextCategory.toLowerCase()}`);
    }
  };

  return (
    <main className="taj-discovery">
      <div className="taj-discovery__breadcrumb">DISCOVER <span aria-hidden="true">/</span> {category.toUpperCase()}</div>
      <div className="taj-discovery__heading">
        <div>
          <h1>Explore {category.toLowerCase()}</h1>
          <p>Search and filter opportunities in one place.</p>
        </div>
        <span className="taj-discovery__prototype">SAMPLE OPPORTUNITIES</span>
      </div>
      <OpportunityFilters
        filters={filters}
        onFilterChange={setFilters}
        onCategoryChange={changeCategory}
        onClear={() => setFilters(initialFilters(category))}
      />
      <section className="taj-discovery__results" aria-label={`${category} results`}>
        <div className="taj-discovery__results-header">
          <div>
            <h2>{category} opportunities</h2>
            <p>{filteredOpportunities.length} {filteredOpportunities.length === 1 ? "result" : "results"} found</p>
          </div>
          <span className="taj-discovery__count">{filteredOpportunities.length} RESULTS</span>
        </div>
        {loading ? (
          <p role="status">Loading opportunities...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : filteredOpportunities.length > 0 ? (
          <div className="taj-discovery__grid">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onViewDetails={onSelectOpportunity}
                onToggleSave={onToggleSave}
                isSaved={savedIds.includes(opportunity.id)}
              />
            ))}
          </div>
        ) : (
          <div className="taj-discovery__empty" role="status">
            <h3>No opportunities match these filters.</h3>
            <p>Try another keyword or clear your filters.</p>
            <button type="button" onClick={() => setFilters(initialFilters(category))}>Clear filters</button>
          </div>
        )}
        <p className="taj-discovery__footnote">These listings are fictional samples for this project. Always verify real requirements and deadlines before applying.</p>
      </section>
    </main>
  );
}
