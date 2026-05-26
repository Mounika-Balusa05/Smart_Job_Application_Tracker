import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const floatingCards = [
  { text: '✅ Got Offer!', company: 'Google', color: '#43e97b' },
  { text: '📨 Applied', company: 'Microsoft', color: '#6c63ff' },
  { text: '📞 Interview', company: 'Amazon', color: '#f7b731' },
  { text: '❌ Rejected', company: 'Meta', color: '#ff6584' },
  { text: '🔍 Screening', company: 'Apple', color: '#38bdf8' },
  { text: '✅ Got Offer!', company: 'Netflix', color: '#43e97b' },
  { text: '📨 Applied', company: 'Infosys', color: '#6c63ff' },
  { text: '📞 Interview', company: 'TCS', color: '#f7b731' },
  { text: '🎉 Accepted!', company: 'Wipro', color: '#43e97b' },
  { text: '❌ Rejected', company: 'Cognizant', color: '#ff6584' },
  { text: '📨 Applied', company: 'Accenture', color: '#6c63ff' },
  { text: '🔍 Screening', company: 'IBM', color: '#38bdf8' },
  { text: '✅ Got Offer!', company: 'Deloitte', color: '#43e97b' },
  { text: '📨 Applied', company: 'Capgemini', color: '#6c63ff' },
  { text: '📞 Interview', company: 'HCL', color: '#f7b731' },
  { text: '🎉 Accepted!', company: 'Zoho', color: '#43e97b' },
];

const snowflakes = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animationDuration: `${5 + Math.random() * 10}s`,
  animationDelay: `${Math.random() * 10}s`,
  fontSize: `${8 + Math.random() * 16}px`,
  opacity: 0.4 + Math.random() * 0.6,
}));

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    try {
      setLoading(true);
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ❄️ Snowflakes */}
      <div className="snowflakes">
        {snowflakes.map(flake => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              animationDuration: flake.animationDuration,
              animationDelay: flake.animationDelay,
              fontSize: flake.fontSize,
              opacity: flake.opacity,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* 🃏 Floating Cards left to right */}
      <div className="floating-cards">
        {floatingCards.map((card, i) => (
          <div
            key={i}
            className="floating-card"
            style={{
              top: `${8 + (i * 5.5) % 85}%`,
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${12 + (i % 5) * 2}s`,
              borderColor: card.color,
            }}
          >
            <span style={{ color: card.color, fontWeight: 700, fontSize: '0.85rem' }}>
              {card.text}
            </span>
            <span style={{ color: '#8888aa', fontSize: '0.75rem', marginTop: 2 }}>
              {card.company}
            </span>
          </div>
        ))}
      </div>

      {/* Login Card */}
      <div className="auth-card">
        <div className="auth-logo">
          <span>🎯</span>
          <h1>JobTrackr</h1>
        </div>
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">Login to track your job applications</p>

        <div className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            className="btn btn-primary auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login 🚀'}
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}