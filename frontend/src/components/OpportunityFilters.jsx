import React from "react";

const categories = ["Internships", "Research", "Scholarships"];

export default function OpportunityFilters({ filters, onFilterChange, onCategoryChange, onClear }) {
  const updateFilter = (name, value) => onFilterChange({ ...filters, [name]: value });

  return (
    <section className="taj-filters" aria-label="Opportunity search and filters">
      <div className="taj-filters__tabs" role="group" aria-label="Opportunity categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`taj-filters__tab ${filters.category === category ? "taj-filters__tab--active" : ""}`}
            onClick={() => onCategoryChange(category)}
            aria-pressed={filters.category === category}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="taj-filters__fields">
        <label className="taj-filters__field taj-filters__field--search" htmlFor="taj-search">
          Search opportunities
          <input
            id="taj-search"
            type="search"
            placeholder="Search by keyword or interest…"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
          />
        </label>
        <label className="taj-filters__field" htmlFor="taj-major">
          Major
          <select id="taj-major" value={filters.major} onChange={(event) => updateFilter("major", event.target.value)}>
            <option value="All">All majors</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
          </select>
        </label>
        <label className="taj-filters__field" htmlFor="taj-location">
          Location
          <select id="taj-location" value={filters.location} onChange={(event) => updateFilter("location", event.target.value)}>
            <option value="All">Any location</option>
            <option value="Fairfax">Fairfax</option>
            <option value="Arlington">Arlington</option>
          </select>
        </label>
        <button type="button" className="taj-filters__clear" onClick={onClear}>Clear filters</button>
      </div>
    </section>
  );
}
