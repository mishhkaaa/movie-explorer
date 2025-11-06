// src/pages/Login.js
import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader'; // optional visual loader (create one if you don’t have it)

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/search';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form); // handled by AuthContext (calls backend)
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto' }}>
      <form onSubmit={onSubmit} aria-busy={loading}>
        <h2>Login</h2>

        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label><br />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: 10 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Optional loader animation */}
          {loading && <Loader size={24} label="Authenticating..." />}
        </div>
      </form>
    </div>
  );
}
