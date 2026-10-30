import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

const SERVER_URL = 'http://localhost:5000'; // for photo display

async function fetchTestimonials() {
  const res = await api.get('/testimonials/admin/all');
  return res.data;
}

export default function TestimonialsManager() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: fetchTestimonials,
  });

  const deleteTestimonial = useMutation({
    mutationFn: id => api.delete(`/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  });

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Testimonials</h1>
          <p className="admin-page-sub">{testimonials.length} review{testimonials.length !== 1 ? 's' : ''} collected</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(true)}>
          <PlusIcon style={{ width: 16, height: 16 }} /> Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : testimonials.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">⭐</div>
            <div className="admin-empty-text">No testimonials yet.</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {testimonials.map(t => (
            <TestimonialCard
              key={t.id}
              t={t}
              onEdit={() => setEditing(t)}
              onDelete={() => { if (window.confirm(`Delete testimonial from "${t.name}"?`)) deleteTestimonial.mutate(t.id); }}
            />
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <TestimonialForm
          testimonial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); setShowForm(false); setEditing(null); }}
        />
      )}
    </>
  );
}

function TestimonialCard({ t, onEdit, onDelete }) {
  const stars = Math.min(5, Math.max(1, Number(t.rating) || 5));
  return (
    <div className="admin-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {t.photo ? (
          <img src={`${SERVER_URL}${t.photo}`} alt={t.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#F59E0B,#8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1rem', color: '#fff',
          }}>
            {(t.name || '?')[0].toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--a-text)' }}>{t.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--a-muted)' }}>{[t.role, t.company].filter(Boolean).join(' · ')}</div>
        </div>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
          background: t.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
          color: t.is_active ? '#34D399' : '#F87171',
        }}>
          {t.is_active ? 'Active' : 'Hidden'}
        </span>
      </div>

      {/* Stars */}
      <div style={{ marginBottom: 8 }}>
        {'★'.repeat(stars)}<span style={{ color: 'var(--a-muted)' }}>{'★'.repeat(5 - stars)}</span>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--a-muted2)', lineHeight: 1.6, marginBottom: 14,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        "{t.message}"
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onEdit}>Edit</button>
        <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

function TestimonialForm({ testimonial: t, onClose, onSaved }) {
  const [name,      setName]      = useState(t?.name || '');
  const [role,      setRole]      = useState(t?.role || '');
  const [company,   setCompany]   = useState(t?.company || '');
  const [message,   setMessage]   = useState(t?.message || '');
  const [rating,    setRating]    = useState(t?.rating || 5);
  const [is_active, setIsActive]  = useState(t?.is_active ?? 1);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  async function handleSave() {
    if (!name.trim() || !message.trim()) { setError('Name and message are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', role);
      formData.append('company', company);
      formData.append('message', message);
      formData.append('rating', rating);
      formData.append('is_active', is_active);

      if (t) {
        await api.put(`/testimonials/${t.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSaved();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div className="admin-modal-title">{t ? 'Edit Testimonial' : 'Add Testimonial'}</div>
          <button className="admin-drawer-close" onClick={onClose}><CloseIcon style={{ width: 20, height: 20 }} /></button>
        </div>

        {error && <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', fontSize: '0.83rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div><label className="admin-label">Name *</label><input className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" /></div>
          <div><label className="admin-label">Role</label><input className="admin-input" value={role} onChange={e => setRole(e.target.value)} placeholder="CEO" /></div>
          <div><label className="admin-label">Company</label><input className="admin-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" /></div>
          <div>
            <label className="admin-label">Rating</label>
            <select className="admin-select" value={rating} onChange={e => setRating(e.target.value)}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Message *</label>
          <textarea className="admin-textarea" rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="What the client said…" />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Status</label>
          <select className="admin-select" value={is_active} onChange={e => setIsActive(Number(e.target.value))}>
            <option value={1}>Active (visible on site)</option>
            <option value={0}>Hidden</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="admin-btn admin-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : t ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 220, borderRadius: 12 }} />
      ))}
    </div>
  );
}
function PlusIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function CloseIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
