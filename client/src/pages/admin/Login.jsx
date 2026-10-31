import { useState } from 'react';
import api, { setToken } from '../../lib/api';
import '../../styles/admin.css';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      window.location.href = '/admin';
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot reach the server. Is it running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page" style={{
      minHeight: '100vh', width: '100%',
      background: '#0A0F1E',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter','Plus Jakarta Sans',system-ui,sans-serif",
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '15%', left: '-80px', width: 380, height: 380,
        background: 'rgba(59,130,246,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '-80px', width: 380, height: 380,
        background: 'rgba(6,182,212,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 22, color: '#fff',
            boxShadow: '0 0 30px rgba(6,182,212,0.4)',
          }}>Z</div>
          <h1 style={{ marginTop: 14, fontSize: '1.4rem', fontWeight: 700, color: '#E2E8F0', letterSpacing: '-0.02em' }}>
            ZeRich Technologies
          </h1>
          <p style={{ color: '#06B6D4', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(15,23,41,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 18,
            padding: '32px 28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          }}
        >
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: 24 }}>
            Sign in to manage your business.
          </p>

          {error && (
            <div style={{
              marginBottom: 16, padding: '10px 14px', borderRadius: 8,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#F87171', fontSize: '0.83rem',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@zerich.com"
              required
              style={{
                width: '100%', background: 'rgba(20,29,53,0.9)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                padding: '10px 13px', color: '#E2E8F0', fontSize: '0.875rem',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.18s',
              }}
              onFocus={e => { e.target.style.borderColor = '#06B6D4'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)'; }}
              onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginBottom: 26 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', background: 'rgba(20,29,53,0.9)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                padding: '10px 13px', color: '#E2E8F0', fontSize: '0.875rem',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.18s',
              }}
              onFocus={e => { e.target.style.borderColor = '#06B6D4'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)'; }}
              onBlur={e =>  { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px 0', borderRadius: 9, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              boxShadow: '0 0 24px rgba(6,182,212,0.3)',
              transition: 'opacity 0.18s, box-shadow 0.18s',
            }}
            onMouseEnter={e => { if (!loading) { e.target.style.boxShadow = '0 0 36px rgba(6,182,212,0.5)'; e.target.style.opacity = '0.92'; }}}
            onMouseLeave={e => { e.target.style.boxShadow = '0 0 24px rgba(6,182,212,0.3)'; e.target.style.opacity = '1'; }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#475569', marginTop: 20 }}>
          Restricted access — authorized personnel only
        </p>
      </div>
    </div>
  );
}