import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Session from './pages/Session/Session';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout({ children }) {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="app-root d-flex flex-column min-vh-100">
      {!hideLayout && <Navbar />}
      <main className={`flex-grow-1 ${hideLayout ? "auth-bg" : ""}`}>
        <div className={hideLayout ? "auth-wrapper" : "container py-4"}>
          {children}
        </div>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Layout> <Login /> </Layout>} />
      <Route
        path="/signup"
        element={
          <Layout>
            <Signup />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/session/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <Session />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Login />} />
      
    </Routes>
  );
}
