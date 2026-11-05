export function filterOpportunities(opportunities, category, filters) {
  const keyword = (filters.search || "").trim().toLowerCase();
  return opportunities.filter((opportunity) => {
    const text = [opportunity.title, opportunity.description, opportunity.organization, opportunity.major,
      opportunity.location, ...(opportunity.skills || [])].filter(Boolean).join(" ").toLowerCase();
    return opportunity.category === category && text.includes(keyword) &&
      (filters.major === "All" || opportunity.major === filters.major || opportunity.major === "All Majors") &&
      (filters.location === "All" || (opportunity.location || "").toLowerCase().includes(filters.location.toLowerCase()));
  });
}
