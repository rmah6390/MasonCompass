const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

export const getProfile = () => request("/api/profile");
export const getRecommendations = () => request("/api/recommendations");

export const updateProfile = (profile) => request("/api/profile", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(profile),
});

// Saved Opportunities endpoints (the backend uses the demo student session).
export const getSavedOpportunities = () => request("/api/saved");
export const saveOpportunity = (opportunityId) => request(`/api/saved/${encodeURIComponent(opportunityId)}`, { method: "POST" });
export const removeSavedOpportunity = (opportunityId) => request(`/api/saved/${encodeURIComponent(opportunityId)}`, { method: "DELETE" });
