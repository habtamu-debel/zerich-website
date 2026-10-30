import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

async function fetchServices() {
  const res = await api.get('/services/admin/all');
  return res.data;
}

export default function ServicesManager() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: fetchServices,
  });

  const createService = useMutation({
    mutationFn: body => api.post('/services', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setShowForm(false); },
  });

  const updateService = useMutation({
    mutationFn: ({ id, ...body }) => api.put(`/services/${id}`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setEditing(null); },
  });

  const deleteService = useMutation({
    mutationFn: id => api.delete(`/services/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Services</h1>
          <p className="admin-page-sub">{services.length} service{services.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(true)}>
          <PlusIcon style={{ width: 16, height: 16 }} /> Add Service
        </button>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : services.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">⚙️</div>
            <div className="admin-empty-text">No services yet. Add your first one.</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {services.map(s => (
            <div key={s.id} className="admin-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, fontSize: '1.3rem',
                    background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.icon || '⚙️'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--a-text)' }}>{s.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--a-muted)', fontFamily: 'monospace' }}>/{s.slug}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                  background: s.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
                  color: s.is_active ? '#34D399' : '#F87171',
                }}>
                  {s.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--a-muted2)', lineHeight: 1.55, marginBottom: 14,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {s.short_description || s.description || 'No description.'}
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditing(s)}>
                  Edit
                </button>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { if (window.confirm(`Delete "${s.title}"?`)) deleteService.mutate(s.id); }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <ServiceForm
          service={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={body => editing
            ? updateService.mutate({ id: editing.id, ...body })
            : createService.mutate(body)
          }
          saving={createService.isPending || updateService.isPending}
        />
      )}
    </>
  );
}

function ServiceForm({ service, onClose, onSave, saving }) {
  const [title,      setTitle]      = useState(service?.title || '');
  const [short_desc, setShortDesc]  = useState(service?.short_description || '');
  const [icon,       setIcon]       = useState(service?.icon || '');
  const [sort_order, setSortOrder]  = useState(service?.sort_order ?? 0);
  const [is_active,  setIsActive]   = useState(service?.is_active ?? 1);

  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div className="admin-modal-title">{service ? 'Edit Service' : 'Add Service'}</div>
          <button className="admin-drawer-close" onClick={onClose}>
            <CloseIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Title *</label>
          <input className="admin-input" placeholder="e.g. ERP Systems" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Short Description</label>
          <textarea className="admin-textarea" rows={2} placeholder="Brief summary shown on cards" value={short_desc} onChange={e => setShortDesc(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label className="admin-label">Icon (emoji)</label>
            <input className="admin-input" placeholder="⚙️" value={icon} onChange={e => setIcon(e.target.value)} />
          </div>
          <div>
            <label className="admin-label">Sort Order</label>
            <input className="admin-input" type="number" value={sort_order} onChange={e => setSortOrder(Number(e.target.value))} />
          </div>
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
          <button
            className="admin-btn admin-btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            disabled={!title.trim() || saving}
            onClick={() => onSave({ title, short_description: short_desc, icon, sort_order, is_active })}
          >
            {saving ? 'Saving…' : service ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 180, borderRadius: 12 }} />
      ))}
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
