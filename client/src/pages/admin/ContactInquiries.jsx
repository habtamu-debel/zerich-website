import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

const STATUSES = ['new', 'contacted', 'closed'];

async function fetchInquiries() {
  const res = await api.get('/leads');
  return res.data;
}

export default function ContactInquiries() {
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['contact-inquiries'],
    queryFn: fetchInquiries,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      api.patch(`/leads/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-inquiries'] }),
  });

  const deleteLead = useMutation({
    mutationFn: id => api.delete(`/leads/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-inquiries'] });
      setSelected(null);
    },
  });

  const filtered = useMemo(() => {
    let list = inquiries;
    if (filterStatus) list = list.filter(l => l.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.service?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [inquiries, filterStatus, search]);

  const counts = useMemo(() => {
    const map = {};
    STATUSES.forEach(s => { map[s] = inquiries.filter(l => l.status === s).length; });
    return map;
  }, [inquiries]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Inquiries</h1>
          <p className="admin-page-sub">{inquiries.length} total submissions from the contact form</p>
        </div>
      </div>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          className={`admin-btn admin-btn-sm ${!filterStatus ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setFilterStatus('')}
        >
          All <span style={{ opacity: 0.7 }}>({inquiries.length})</span>
        </button>
        {STATUSES.map(s => (
          <button
            key={s}
            className={`admin-btn admin-btn-sm ${filterStatus === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setFilterStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}{' '}
            <span style={{ opacity: 0.7 }}>({counts[s] || 0})</span>
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-search-wrap" style={{ maxWidth: 320 }}>
            <SearchIcon className="admin-search-icon" style={{ width: 15, height: 15 }} />
            <input
              className="admin-input"
              style={{ paddingLeft: 34 }}
              placeholder="Search name, email, service…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          {isLoading ? (
            <SkeletonTable />
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📭</div>
              <div className="admin-empty-text">No inquiries found.</div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} onClick={() => setSelected(l)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: 'linear-gradient(135deg,#8B5CF6,#06B6D4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.8rem', color: '#fff',
                        }}>
                          {(l.name || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{l.name}</span>
                      </div>
                    </td>
                    <td className="td-muted">{l.email}</td>
                    <td className="td-muted">{l.phone || '—'}</td>
                    <td>
                      {l.service
                        ? <span className="stage-pill">{l.service}</span>
                        : <span style={{ color: 'var(--a-muted)' }}>—</span>}
                    </td>
                    <td>
                      <select
                        className="badge"
                        style={{
                          background: l.status === 'new' ? 'rgba(6,182,212,0.15)' : l.status === 'contacted' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                          color: l.status === 'new' ? '#22D3EE' : l.status === 'contacted' ? '#60A5FA' : '#34D399',
                          border: 'none', cursor: 'pointer', appearance: 'none',
                        }}
                        value={l.status || 'new'}
                        onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus.mutate({ id: l.id, status: e.target.value })}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s} style={{ background: '#141d35', color: '#E2E8F0' }}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="td-muted">
                      {l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => { if (window.confirm('Delete this inquiry?')) deleteLead.mutate(l.id); }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div className="admin-modal-title">{selected.name}</div>
              <button className="admin-drawer-close" onClick={() => setSelected(null)}>
                <CloseIcon style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div className="admin-info-grid">
              <InfoItem label="Email"   value={selected.email} />
              <InfoItem label="Phone"   value={selected.phone || '—'} />
              <InfoItem label="Service" value={selected.service || '—'} />
              <InfoItem label="Date"    value={selected.created_at ? new Date(selected.created_at).toLocaleDateString() : '—'} />
            </div>
            {selected.message && (
              <div style={{ marginTop: 8 }}>
                <label className="admin-label">Message</label>
                <div style={{
                  background: 'var(--a-surface2)', border: '1px solid var(--a-border)',
                  borderRadius: 8, padding: '12px 14px', fontSize: '0.875rem',
                  color: 'var(--a-muted2)', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                }}>
                  {selected.message}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="admin-info-item">
      <label>{label}</label>
      <span>{value}</span>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div style={{ padding: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 8 }} />
      ))}
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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
