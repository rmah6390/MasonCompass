import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOpportunityDetails } from "../services/opportunityService";
import "./OpportunityDetails.css";

/** UI layer for viewing one opportunity. Business rules and database access
 * are handled by the API; this component manages display and request state. */
export default function OpportunityDetails({ opportunity: initialOpportunity, returnTo = "/discover" }) {
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(initialOpportunity || null);
  const [loading, setLoading] = useState(Boolean(initialOpportunity?.id));
  const [error, setError] = useState("");
  const opportunityId = initialOpportunity?.id;

  useEffect(() => {
    if (!opportunityId) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    setError("");
    getOpportunityDetails(opportunityId)
      .then((record) => { if (active) setOpportunity(record); })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          // Keep the selected sample record visible if the API is unavailable.
          setOpportunity(initialOpportunity || null);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [opportunityId]);

  const requirements = Array.isArray(opportunity?.requirements)
    ? opportunity.requirements
    : opportunity?.requirements ? [opportunity.requirements] : [];
  const officialUrl = opportunity?.officialUrl || opportunity?.official_url;

  return (
    <div className="page">
      <div className="container">
        <button type="button" className="back-button" onClick={() => navigate(returnTo)}>
          ← Back to opportunities / results
        </button>
        {loading && <p role="status">Loading opportunity details…</p>}
        {error && <p role="status">Live details unavailable: {error} Showing the selected opportunity data instead.</p>}
        {!opportunity && !loading && (
          <div className="main-card"><h3>Opportunity unavailable</h3><p>Select an opportunity from Discover to view its details.</p></div>
        )}
        {opportunity && (
          <>
            <div className="title-row">
              <h1>{opportunity.title}</h1>
              <span>{opportunity.isSample || opportunity.is_sample ? "SAMPLE OPPORTUNITY" : "OPPORTUNITY"}</span>
            </div>
            <div className="card-layout">
              <div className="main-card">
                <h3>About this opportunity</h3>
                <p>{opportunity.description || "No description provided."}</p>
                <p className="tags">{[opportunity.category, opportunity.major].filter(Boolean).join(" • ")}</p>
                <h3>Requirements</h3>
                {requirements.length ? <ul>{requirements.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul> : <p>Requirements are not specified.</p>}
              </div>
              <div className="side-card">
                <h3>At a glance</h3>
                <p>Organization: {opportunity.organization || "Not specified"}</p>
                <p>Location: {opportunity.location || "Not specified"}</p>
                <p>Deadline: {opportunity.deadline || "Not specified"}</p>
                {officialUrl ? (
                  <a href={officialUrl} target="_blank" rel="noreferrer"><button type="button">View Official Posting ↗</button></a>
                ) : <button type="button" disabled>Official Posting Unavailable</button>}
                <small>Verify the details and deadline on the organization's official posting.</small>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
