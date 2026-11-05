export const tajRawOpportunities = [

  {
    id: 1,
    title: 'Undergraduate AI Research Assistant',
    category: 'Research',
    major: 'Computer Science',
    organization: 'George Mason University',
    description: 'Explore machine learning and artificial intelligence research.',
    deadline: 'December 15, 2026',
    requirements: 'Interest in Python, machine learning, and research.',
  },
  {
    id: 2,
    title: 'Software Engineering Internship',
    category: 'Internships',
    major: 'Computer Science',
    organization: 'Technology Company',
    description: 'Gain hands-on experience developing web applications.',
    deadline: 'January 10, 2027',
    requirements: 'Basic JavaScript and programming knowledge.',
  },
  {
    id: 3,
    title: 'Engineering Research Program',
    category: 'Research',
    major: 'Engineering',
    organization: 'George Mason University',
    description: 'Participate in engineering research projects.',
    deadline: 'December 20, 2026',
    requirements: 'Engineering major or related experience.',
  },
  {
    id: 4,
    title: 'Student Academic Scholarship',
    category: 'Scholarships',
    major: 'Business',
    organization: 'GMU Student Resources',
    description: 'Scholarship opportunity for undergraduate students.',
    deadline: 'February 1, 2027',
    requirements: 'Undergraduate student in good academic standing.',
  },
  {
    id: 5,
    title: 'Campus Technology Networking Event',
    category: 'Campus Events',
    major: 'Information Technology',
    organization: 'GMU Student Organizations',
    description: 'Connect with students and technology professionals.',
    deadline: 'November 30, 2026',
    requirements: 'Open to interested students.',
  },
];

const knownCategories = new Set(["Internships", "Research", "Scholarships"]);
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const tajAdaptedOpportunities = tajRawOpportunities
  .filter((item) => knownCategories.has(item.category))
  .map((item) => ({
    id: `taj-${slug(item.title)}`,
    title: item.title,
    category: item.category,
    major: item.major,
    organization: item.organization,
    description: item.description,
    deadline: item.deadline,
    requirements: [item.requirements],
    location: item.organization.includes("George Mason") || item.organization.includes("GMU") ? "Fairfax, VA" : "Not specified",
    timing: "See opportunity",
    skills: item.major === "Computer Science" ? ["Computer Science"] : [item.major],
    fit: "Explore opportunity",
    fitReason: `Listed for ${item.major} students`,
    level: "Undergraduate",
  }));
