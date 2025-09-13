// Dashboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ToastContainer, toast } from 'react-toastify';

export default function Dashboard() {
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  // create session
  const handleCreate = async () => {
    try {
      setLoadingCreate(true);
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/session/create",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = res.data?.code;
      setCreatedCode(sessionId);
      setTimeLeft(60); // 60s countdown
      toast.success("✅ Session created successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        `❌ Failed to create session: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoadingCreate(false);
    }
  };

  // countdown timer
  useEffect(() => {
    if (!createdCode || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCreatedCode("");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [createdCode, timeLeft]);

  // join session from dashboard
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode) return toast.warning("⚠️ Enter session code first");

    try {
      setLoadingJoin(true);
      const token = localStorage.getItem("token");

      await API.post(
        `/session/join/${joinCode}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Joined session successfully!");
      navigate(`/session/${joinCode}`);
    } catch (err) {
      console.error(err);
      toast.error(
        `❌ Failed to join session: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    toast.info("📋 Code copied!");

    setTimeout(() => setCopied(false), 2000); // reset text after 2s
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        minHeight: "calc(100vh - 160px)",
        overflowX: "hidden",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
        <ToastContainer />
      <div className="row w-100">
        {/* Intro Section */}
        <div className="col-12 text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to Transflow
          </h2>
          <p className="text-muted">
            If you already have a session code, enter it below to join. <br />
            New here? Create a session, share the code, and decide a meeting
            point with others.
          </p>
        </div>

        {/* Create Session Card */}
        <div className="col-12 col-md-6 mb-4">
          <div
            className="card h-100 shadow border-0"
            style={{
              borderRadius: "20px",
              background: "white",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <div className="card-body d-flex flex-column text-center p-4">
              <h4 className="fw-bold mb-3 text-primary">Create a Session</h4>
              <p className="text-muted mb-4">
                Generate a unique code and share it with friends or colleagues
                to collaborate instantly.
              </p>

              {/* Session Code Block */}
              {createdCode && (
                <div className="mb-3">
                  <h5 className="fw-bold text-success">✅ Session Created!</h5>
                  <small className="text-muted">
                    Expires in {timeLeft} sec
                  </small>
                  <div
                    className="d-flex justify-content-center align-items-center gap-2 mt-2 p-2 border rounded"
                    style={{ background: "#f8f9fa" }}
                  >
                    <span className="fw-bold text-dark">{createdCode}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleCopy}
                    >
                      {copied ? "✔ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              )}

              <button
                className="btn mt-auto w-100 py-2 d-flex justify-content-center align-items-center gap-2"
                onClick={handleCreate}
                disabled={loadingCreate}
                style={{
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "0.3s",
                  opacity: loadingCreate ? "0.7" : "1",
                }}
              >
                {loadingCreate ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    ></span>
                    Creating...
                  </>
                ) : (
                  "🚀 Create Session"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Join Session Card */}
        <div className="col-12 col-md-6 mb-4">
          <div
            className="card h-100 shadow border-0"
            style={{
              borderRadius: "20px",
              background: "white",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <div className="card-body d-flex flex-column text-center p-4">
              <h4 className="fw-bold mb-3 text-info">Join a Session</h4>
              <p className="text-muted mb-4">
                Have a session code? Enter it below to join instantly and start
                sharing.
              </p>
              <form
                onSubmit={handleJoin}
                className="d-flex flex-column flex-sm-row gap-2 mt-auto"
              >
                <input
                  className="form-control flex-grow-1"
                  placeholder="Enter session code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                />
               <button
  className="btn px-4 d-flex justify-content-center align-items-center gap-2"
  type="submit"
  disabled={loadingJoin || !joinCode.trim()} // 🔑 disable if no code
  style={{
    background:
      "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "16px",
    transition: "0.3s",
    opacity: loadingJoin || !joinCode.trim() ? "0.6" : "1", // dim if disabled
    cursor: loadingJoin || !joinCode.trim() ? "not-allowed" : "pointer", // UX feedback
  }}
>

                  {loadingJoin ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                      ></span>
                      Joining...
                    </>
                  ) : (
                    "🔑 Join"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
