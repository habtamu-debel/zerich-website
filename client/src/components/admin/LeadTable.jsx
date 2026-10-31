import { useMemo } from 'react';

export default function LeadTable({ leads, onMarkHot, onFilterChange }) {
  const activeFilters = useMemo(() => new Set(
    Object.values(onFilterChange).filter(v => v && v !== 'all')
  ), [onFilterChange]);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (onFilterChange.status !== 'all' && String(l.status) !== onFilterChange.status) return false;
      if (onFilterChange.hot !== 'all' && String(!!l.is_hot) !== onFilterChange.hot) return false;
      if (onFilterChange.priority !== 'all' && (l.priority || 'medium') !== onFilterChange.priority) return false;
      if (onFilterChange.service !== 'all' && (l.service_interested || '').toLowerCase().indexOf(onFilterChange.service.toLowerCase()) === -1) return false;
      return true;
    });
  }, [leads, onFilterChange]);

  const priorityColors = {
    high: 'rgba(239,68,68,0.18)', highText: '#F87171',
    medium: 'rgba(245,158,11,0.18)', mediumText: '#F59E0B',
    low: 'rgba(59,130,246,0.18)', lowText: '#60A5FA',
  };

  return (
    <>
      <div className="admin-table-sticky-header">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--a-muted2)', padding: '0 12px' }}>
          <div>Name</div>
          <div>Contact</div>
          <div>Service</div>
          <div>Status</div>
          <div>Priority</div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card"><div className="admin-empty" style={{ paddingTop: 48, paddingBottom: 48 }}>No leads match current filters.</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(l => (
            <div className="admin-card" key={l.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
              {/* Name */}
              <div>
                <div style={{ fontWeight: 700, color: 'var(--a-text)', fontSize: '0.85rem' }}>{l.name || '—'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--a-muted)' }}>{l.company || '—'}</div>
              </div>
              {/* Contact */}
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--a-text)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  {l.email ? <span>📧 {l.email}</span> : <span style={{ color: 'var(--a-muted)' }}>No email</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--a-muted)' }}>{l.phone || '—'}</div>
              </div>
              {/* Service interested */}
              <div style={{ fontSize: '0.78rem', color: 'var(--a-muted2)' }}>
                {l.service_interested ? l.service_interested.split(',')[0].trim() : '—'}
              </div>
              {/* Status */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => onMarkHot(l.id, !l.is_hot)}
                  className="admin-btn admin-btn-sm"
                  style={{
                    background: l.is_hot ? '#F59E0B' : 'var(--a-bg)',
                    color: l.is_hot ? '#000' : 'var(--a-text)',
                    border: l.is_hot ? 'none' : '1px solid var(--a-border)',
                  }}
                >
                  {l.is_hot ? '⭐ Hot' : 'Mark Hot'}
                </button>
              </div>
              {/* Priority */}
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 999,
                  background: priorityColors[l.priority || 'medium'], color: priorityColors[(l.priority || 'medium') + 'Text'] }}>
                  {(l.priority || 'medium').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
