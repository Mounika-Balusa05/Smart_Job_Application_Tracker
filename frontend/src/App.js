import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Interviews from './pages/Interviews';
import Login from './pages/Login';
import Register from './pages/Register';
import NotificationBell from './components/NotificationBell';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="empty-state"><div className="emoji">⏳</div><p>Loading...</p></div>;
  return user ? children : <Navigate to="/login" />;
};


  function AppLayout() {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <>
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">JobTrackr</span>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
            <span>📊</span> Dashboard
          </NavLink></li>
          <li><NavLink to="/applications" className={({isActive}) => isActive ? 'active' : ''}>
            <span>📋</span> Applications
          </NavLink></li>
          <li><NavLink to="/interviews" className={({isActive}) => isActive ? 'active' : ''}>
            <span>📅</span> Interviews
          </NavLink></li>
        </ul>
        
        {user && (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
        )}
        {user && (
          <button className="btn-logout" onClick={logout}>
            🚪 Logout
          </button>
        )}
        <div className="sidebar-footer">
          <p>Smart Job Tracker</p>
        </div>
      </nav>

      {/* Topbar */}
      <div className="topbar">
        <NotificationBell />
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;