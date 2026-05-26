import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { name, username, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccessMsg('Registered successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <p className="subtitle">Start your investment journey with TradeVista today.</p>
        {error && <div className="error-msg">{error}</div>}
        {successMsg && <div className="success-msg" style={{ color: '#4caf50', background: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #c8e6c9', fontSize: '0.9rem' }}>{successMsg}</div>}
        <form onSubmit={handleSignup}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button type="submit">Signup</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
