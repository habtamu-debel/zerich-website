import { useState } from 'react';

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];

export default function LeadDrawer({ lead, onClose, onSave, saving }) {
  const [status, setStatus] = useState(lead.status || 'new');
  const [notes, setNotes] = useState(lead.admin_notes || '');

  let systems = [];
  try { systems = JSON.parse(lead.required_systems || '[]'); } catch {}

  return (
    <div className="admin-drawer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-drawer">
        <div className="admin-drawer-header">
          <div>
            <div className="admin-drawer-title">{lead.client_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--a-muted)', marginTop: 2 }}>{lead.email}</div>
          </div>
          <button className="admin-drawer-close" onClick={onClose}>
            <CloseIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Lead Info Grid */}
        <div className="admin-info-grid" style={{ marginBottom: 20 }}>
          <InfoItem label="Company"   value={lead.company     || '—'} />
          <InfoItem label="Industry"  value={lead.industry    || '—'} />
          <InfoItem label="Phone"     value={lead.phone       || '—'} />
          <InfoItem label="Budget"    value={lead.budget_range|| '—'} />
          <InfoItem label="Source"    value={lead.source      || '—'} />
          <InfoItem label="Date"      value={lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'} />
        </div>

        {systems.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label className="admin-label">Required Systems</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {systems.map(s => (
                <span key={s} className="stage-pill">{s}</span>
              ))}
            </div>
          </div>
        )}

        {lead.message && (
          <div style={{ marginBottom: 20 }}>
            <label className="admin-label">Message</label>
            <div style={{
              background: 'var(--a-surface2)', border: '1px solid var(--a-border)',
              borderRadius: 8, padding: '10px 12px', fontSize: '0.85rem',
              color: 'var(--a-muted2)', lineHeight: 1.6,
            }}>
              {lead.message}
            </div>
          </div>
        )}

        <hr className="admin-divider" />

        <div className="admin-form-group">
          <label className="admin-label">Status</label>
          <select
            className="admin-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Admin Notes</label>
          <textarea
            className="admin-textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Add notes about this lead…"
          />
        </div>

        <button
          className="admin-btn admin-btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
          onClick={() => onSave(status, notes)}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
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

function CloseIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}