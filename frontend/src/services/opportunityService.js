const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getOpportunityDetails(opportunityId) {
  if (!opportunityId) throw new Error("An opportunity ID is required.");
  const response = await fetch(`${API_BASE_URL}/api/opportunities/${encodeURIComponent(opportunityId)}`);
  if (response.status === 404) throw new Error("This opportunity could not be found.");
  if (!response.ok) throw new Error("Unable to load opportunity details. Please try again.");
  return response.json();
}
