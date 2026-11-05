import { useNavigate } from "react-router-dom";
import "./OpportunityDetails.css";
export default function OpportunityDetails() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <header className="header">
        <div className="logo">MasonCompass</div>

        <div className="nav">
          <button className="profile">
            <span>Discover</span>
            <span> • </span>
            <span>Profile</span>
          </button>
        </div>
      </header>

      <div className="container">
        <button type="button" className="back-button" onClick={() => navigate("/discover")}>
          ← Back to internships / results (04C)
        </button>

        <div className="title-row">
          <h1>Software Engineering Intern</h1>
          <span>SAMPLE OPPORTUNITY</span>
        </div>

        <div className="card-layout">
          <div className="main-card">
            <h3>About this opportunity</h3>

            <p>
              Capital One is hiring a Software Engineer Intern to build
              capabilities across our loan platform – from the React UI that
              loan seekers interact with daily to the Python/Django services
              that power it. You'll work across the stack, developing features
              end-to-end and gaining hands-on experience with cloud-native
              infrastructure.
            </p>

            <a href="/">Why you're seeing this</a>

            <p className="tags">Computer Science • Technology</p>

            <a href="/">Requirments:</a>

            <p className="tags">Software Engennering experience: Complete </p>

            <p className="tags">Python experience: Complete</p>
          </div>

          <div className="side-card">
            <h3>At a glance</h3>

            <p>Level: Undergraduate</p>
            <p>Deadline: December 31st</p>

            <button>View Official Posting ↗</button>

            <small>Your good to go! apply on the official posting.</small>
          </div>
        </div>
      </div>
    </div>
  );
}