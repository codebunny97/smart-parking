import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    login(name.trim(), role);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo area */}
        <div style={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#1a73e8" />
            <text x="9" y="23" fontSize="18" fontWeight="700" fill="white" fontFamily="Arial">P</text>
          </svg>
          <span style={styles.logoText}>ParkFinder</span>
        </div>

        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>to continue to ParkFinder</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.roleRow}>
              {['user', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  style={{ ...styles.roleBtn, ...(role === r ? styles.roleBtnActive : {}) }}
                  onClick={() => setRole(r)}
                >
                  {r === 'user' ? 'User' : 'Admin'}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitBtn}>Continue</button>
        </form>

        <p style={styles.hint}>
          {role === 'admin'
            ? 'Admin can add, edit, and delete parking spots.'
            : 'Users can browse and navigate to parking spots.'}
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '40px 36px',
    width: '360px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: '-0.3px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '400',
    color: '#202124',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#5f6368',
    margin: '0 0 28px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#5f6368', fontWeight: '500' },
  input: {
    padding: '10px 12px',
    border: '1px solid #dadce0',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#202124',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  roleRow: { display: 'flex', gap: '10px' },
  roleBtn: {
    flex: 1,
    padding: '10px',
    border: '1px solid #dadce0',
    borderRadius: '6px',
    background: '#fff',
    fontSize: '14px',
    color: '#5f6368',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    transition: 'all 0.15s',
  },
  roleBtnActive: {
    border: '2px solid #1a73e8',
    color: '#1a73e8',
    background: '#e8f0fe',
    fontWeight: '600',
  },
  error: { color: '#d93025', fontSize: '13px', margin: 0 },
  submitBtn: {
    padding: '11px',
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  hint: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#9aa0a6',
    textAlign: 'center',
    lineHeight: '1.5',
  },
};
