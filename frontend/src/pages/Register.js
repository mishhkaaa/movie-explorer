// src/pages/Register.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate('/search'); // or wherever
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username</label><br/>
          <input name="username" value={form.username} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label><br/>
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <label>Password</label><br/>
          <input name="password" type="password" value={form.password} onChange={onChange} required minLength={6} />
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
}
