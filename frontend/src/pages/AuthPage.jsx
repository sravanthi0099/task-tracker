import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (mode === 'register' && form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created! Welcome aboard 🎉');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setErrors({});
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>✦</div>
          <span style={styles.brandName}>TaskFlow</span>
        </div>
        <div style={styles.heroText}>
          <h1 style={styles.heroH1}>Stay focused.<br />Ship faster.</h1>
          <p style={styles.heroP}>A clean, powerful task tracker built for developers who mean business.</p>
        </div>
        <div style={styles.features}>
          {['CRUD with REST APIs', 'JWT Authentication', 'Filter & Sort tasks', 'Live updates, no page refresh'].map(f => (
            <div key={f} style={styles.feature}>
              <span style={styles.featureDot}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
            <p style={styles.cardSub}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button style={styles.switchBtn} onClick={switchMode}>
                {mode === 'login' ? 'Register' : 'Sign in'}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  className={`form-input${errors.name ? ' error' : ''}`}
                  type="text" placeholder="Ada Lovelace"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className={`form-input${errors.email ? ' error' : ''}`}
                type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className={`form-input${errors.password ? ' error' : ''}`}
                type="password" placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    color: 'white', position: 'relative', overflow: 'hidden',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { fontSize: 24, background: 'rgba(255,255,255,0.2)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 20, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 },
  heroText: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 },
  heroH1: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
  heroP: { fontSize: 16, opacity: 0.85, maxWidth: 360, lineHeight: 1.6 },
  features: { display: 'flex', flexDirection: 'column', gap: 10 },
  feature: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, opacity: 0.9 },
  featureDot: { background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 },
  right: { width: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg)' },
  card: { width: '100%', background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '32px', boxShadow: 'var(--shadow-md)', border: '1.5px solid var(--border)' },
  cardHeader: { marginBottom: 24 },
  cardTitle: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 6 },
  cardSub: { fontSize: 14, color: 'var(--text-2)' },
  switchBtn: { background: 'none', border: 'none', color: 'var(--indigo)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', padding: 0, fontFamily: 'inherit' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
};

// Make responsive
const mediaStyle = document.createElement('style');
mediaStyle.textContent = `@media (max-width: 768px) { .auth-left { display: none !important; } .auth-right { width: 100% !important; } }`;
document.head.appendChild(mediaStyle);

export default AuthPage;
