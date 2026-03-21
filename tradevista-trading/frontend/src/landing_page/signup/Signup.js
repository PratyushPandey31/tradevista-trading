import React, { useState } from 'react';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '36px',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '8px',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  },
  inputError: {
    borderColor: '#ff6b6b',
    background: 'rgba(255,107,107,0.08)',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '12px',
    marginTop: '5px',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6c63ff, #3ecfcf)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  successBox: {
    background: 'rgba(62,207,127,0.12)',
    border: '1px solid rgba(62,207,127,0.3)',
    borderRadius: '10px',
    color: '#3ecf7f',
    padding: '14px',
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '20px',
  },
  loginText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
    textAlign: 'center',
    marginTop: '24px',
  },
  loginLink: {
    color: '#6c63ff',
    cursor: 'pointer',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    fontSize: '13px',
    padding: 0,
  },
};

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Full name is required.';
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (!fields.confirm) {
    errors.confirm = 'Please confirm your password.';
  } else if (fields.confirm !== fields.password) {
    errors.confirm = 'Passwords do not match.';
  }
  return errors;
}

function Signup() {
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const inputStyle = (field) => ({
    ...styles.input,
    ...(errors[field] ? styles.inputError : {}),
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Sign up to get started today</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              style={inputStyle('name')}
              type="text"
              name="name"
              placeholder="John Doe"
              value={fields.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              style={inputStyle('email')}
              type="email"
              name="email"
              placeholder="john@example.com"
              value={fields.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={inputStyle('password')}
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={fields.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <p style={styles.errorText}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={inputStyle('confirm')}
              type="password"
              name="confirm"
              placeholder="Repeat password"
              value={fields.confirm}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirm && <p style={styles.errorText}>{errors.confirm}</p>}
          </div>

          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {submitted && (
          <div style={styles.successBox}>
            🎉 Account created successfully! Welcome, {fields.name}!
          </div>
        )}

        <p style={styles.loginText}>
          Already have an account?{' '}
          <button style={styles.loginLink} onClick={() => alert('Navigate to Login')}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
export default Signup;
