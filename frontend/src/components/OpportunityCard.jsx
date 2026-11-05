import React from "react";

export default function OpportunityCard({ opportunity, onViewDetails, isSaved, onToggleSave }) {
  return (
    <article className="taj-card">
      <div className="taj-card__top">
        <span className="taj-card__badge">{opportunity.category}</span>
        <button
          type="button"
          className={`taj-card__bookmark ${isSaved ? "taj-card__bookmark--saved" : ""}`}
          onClick={() => onToggleSave(opportunity)}
          aria-label={`${isSaved ? "Remove saved" : "Save"} ${opportunity.title}`}
          aria-pressed={Boolean(isSaved)}
          title={isSaved ? "Remove saved opportunity" : "Save opportunity"}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>
      <h2>{opportunity.title}</h2>
      <p className="taj-card__organization">{opportunity.organization} · {opportunity.location || "Location not specified"}</p>
      <p className="taj-card__description">{opportunity.description}</p>
      <div className="taj-card__meta">
        <span>{opportunity.major || "All majors"}</span>
        <span>{opportunity.deadline || "Deadline not specified"}</span>
      </div>
      <div className="taj-card__footer">
        <span>{opportunity.fit || "Opportunity"}</span>
        <button type="button" className="taj-card__details" onClick={() => onViewDetails(opportunity)}>
          View Details <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}
