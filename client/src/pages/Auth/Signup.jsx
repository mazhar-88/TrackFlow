import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', formData);
      localStorage.setItem("token", res.data.token); // token save
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="auth-card card shadow-lg">
      <div className="card-body text-center">
        {/* <h2 className="mb-4 text-primary fw-bold">TrackFlow</h2> */}
        <h2
          className="mb-4 fw-bold"
          style={{
            background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TrackFlow
        </h2>
        {/* <h4 className="mb-3">Sign Up</h4> */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Full name</label>
            <input
              required
              type="text"
              className="form-control"
              placeholder="Your name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              required
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input
              required
              type="password"
              className="form-control"
              placeholder="Choose a strong password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button className="btn  w-100" style={{
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
          }} type="submit">
            Sign up
          </button>
        </form>
        <div className="mt-3">
          <small>
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-semibold"
              style={{
                background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
