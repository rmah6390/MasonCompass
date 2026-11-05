.profile-page {
  min-height: 100vh;
  background-color: #f7f8f5;
  font-family: Arial, sans-serif;
  color: #24352d;
}

.profile-header {
  background-color: #145a3c;
  color: white;
  padding: 25px;
  text-align: center;
}

.profile-header h1 {
  margin: 0;
  font-size: 30px;
}

.profile-header p {
  margin-bottom: 0;
  font-size: 15px;
}

.profile-container {
  max-width: 650px;
  margin: 35px auto;
  padding: 0 15px 35px;
}

.profile-card {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

.profile-card h2 {
  margin-top: 0;
  color: #145a3c;
}

.profile-subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 25px;
}

.profile-card label {
  display: block;
  font-weight: bold;
  margin-top: 18px;
  margin-bottom: 8px;
}

.profile-card input,
.profile-card select,
.profile-card textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.profile-card input:focus,
.profile-card select:focus,
.profile-card textarea:focus {
  outline: 2px solid #81b89a;
  border-color: #145a3c;
}

.profile-buttons {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.save-button {
  background-color: #145a3c;
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  margin-top: 15px;
}

.save-button:hover {
  background-color: #0d422b;
}

.cancel-button {
  background-color: #e5e5e5;
  color: #333;
  border: none;
  padding: 12px 22px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
}

.profile-message {
  padding: 14px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.success {
  background-color: #dff2e5;
  color: #17623a;
}

.error {
  background-color: #ffe5e5;
  color: #9c2222;
}

.profile-info {
  background-color: #f7f8f5;
  padding: 20px;
  border-radius: 8px;
}

.profile-info p {
  margin: 12px 0;
  overflow-wrap: anywhere;
}

.recommendation-note {
  margin-top: 25px;
  padding: 18px;
  background-color: #edf5ee;
  border-left: 4px solid #145a3c;
  border-radius: 5px;
}

.recommendation-note h3 {
  margin-top: 0;
}

@media (max-width: 600px) {
  .profile-card {
    padding: 20px;
  }

  .profile-buttons {
    flex-direction: column;
  }
}
