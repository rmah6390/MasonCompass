import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StudentProfile from "./components/StudentProfile";
import "./App.css";

function Home() {
  return (
    <div>
      <h1>Welcome to MasonCompass</h1>
      <p>Discover opportunities at George Mason University.</p>
    </div>
  );
}

function StudentProfile() {
  return <h2>Student Profile Page</h2>;
}

function Recommendations() {
  return <h2>Personalized Recommendations Page</h2>;
}

function OpportunitySearch() {
  return <h2>Opportunity Search and Filtering Page</h2>;
}

function OpportunityDetails() {
  return <h2>Opportunity Details Page</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/profile">Profile</Link> |{" "}
        <Link to="/recommendations">Recommendations</Link> |{" "}
        <Link to="/discover">Discover</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/discover" element={<OpportunitySearch />} />
        <Route path="/details" element={<OpportunityDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
