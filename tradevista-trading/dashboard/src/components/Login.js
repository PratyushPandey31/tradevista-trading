import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccessMsg('Logged in successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <p className="subtitle">Welcome back! Access your secure portfolio terminal.</p>
        {error && <div className="error-msg">{error}</div>}
        {successMsg && <div className="success-msg" style={{ color: '#4caf50', background: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #c8e6c9', fontSize: '0.9rem' }}>{successMsg}</div>}
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
};

export default Login;
