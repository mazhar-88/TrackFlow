import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem("token", res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="auth-card card shadow-lg">
      <div className="card-body text-center">
        {/* TrackFlow gradient text */}
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

        {/* Removed Login heading */}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Gradient Login button */}
          <button
            className="btn w-100"
            type="submit"
            style={{
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
            }}
          >
            Login
          </button>
        </form>

        <div className="mt-3">
          <small>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="fw-semibold"
              style={{
                background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
