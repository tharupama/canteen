import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import UserApp from './pages/UserApp';
import StaffApp from './pages/StaffApp';
import Setup from './components/Setup';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserApp />} />
          <Route path="/staff" element={<StaffApp />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const HomePage: React.FC = () => {
  return (
    <div
      className="home-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        backgroundImage: "url('/canteen-bg.jpg')", // put your image in public/images
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // keeps image fixed on scroll
      }}
    >
      <h1
  style={{
    fontSize: "4rem",
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#eaf0f1ff", // light blue
    textAlign: "center",
    animation: "textPop 1s ease-in-out forwards",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.6)", // black shadow
  }}
>
  University Canteen
</h1>
      <p
  style={{
    fontSize: "1.8rem",
    marginBottom: "50px",
    fontWeight: "600",
    color: "#ffffff", // bright white
    textAlign: "center",
    textShadow: "2px 2px 8px rgba(0,0,0,0.7)", // black shadow for contrast
    letterSpacing: "1px",
  }}
>
  Order your favorite food online
</p>

      <div
        className="app-links"
        style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}
      >
        <Link to="/user" className="app-link" style={{ textDecoration: "none" }}>
          <div
            className="link-card"
            style={{
              background: "rgba(255, 255, 255, 1)", // semi-transparent for readability
              color: "blue",
              padding: "40px 60px",
              borderRadius: "15px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              minWidth: "250px",
              textAlign: "center",
              transition: "transform 0.3s",
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>Start Ordering</h2>
            <p>Browse menu and place your order</p>
          </div>
        </Link>
      </div>
    </div>
  );
};


export default App;
