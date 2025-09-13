import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login")
  }

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold text-white" to="/dashboard">
          TrackFlow
        </Link>
        <div>
          <button className="btn btn-light btn-sm fw-semibold" onClick={handleLogOut} >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
