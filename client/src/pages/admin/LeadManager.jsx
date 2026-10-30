import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import LeadDrawer from '../../components/admin/LeadDrawer';

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];

async function fetchLeads(filters) {
  const res = await api.get('/admin/leads', { params: filters });
  return res.data;
}

export default function LeadManager() {
  const [filters, setFilters] = useState({ status: '', industry: '' });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => fetchLeads(filters),
  });

  const updateLead = useMutation({
    mutationFn: ({ id, status, notes }) =>
      api.patch(`/admin/leads/${id}`, { status, notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      setSelected(null);
    },
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      l =>
        l.client_name?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.industry?.toLowerCase().includes(q)
    );
  }, [leads, search]);

  const counts = useMemo(() => {
    const map = {};
    STATUSES.forEach(s => { map[s] = leads.filter(l => l.status === s).length; });
    return map;
  }, [leads]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Leads</h1>
          <p className="admin-page-sub">{leads.length} total leads</p>
        </div>
      </div>

      {/* Status Pill Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          className={`admin-btn admin-btn-sm ${filters.status === '' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setFilters(f => ({ ...f, status: '' }))}
        >
          All <span style={{ opacity: 0.7 }}>({leads.length})</span>
        </button>
        {STATUSES.map(s => (
          <button
            key={s}
            className={`admin-btn admin-btn-sm ${filters.status === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setFilters(f => ({ ...f, status: s }))}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}{' '}
            <span style={{ opacity: 0.7 }}>({counts[s] || 0})</span>
          </button>
        ))}
      </div>

      <div className="admin-card">
        {/* Card Header — Search & Filter */}
        <div className="admin-card-header">
          <div className="admin-search-wrap" style={{ maxWidth: 320 }}>
            <SearchIcon className="admin-search-icon" style={{ width: 15, height: 15 }} />
            <input
              className="admin-input"
              style={{ paddingLeft: 34 }}
              placeholder="Search name, company, email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="admin-input"
              placeholder="Filter industry"
              style={{ width: 160 }}
              value={filters.industry}
              onChange={e => setFilters(f => ({ ...f, industry: e.target.value }))}
            />
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          {isLoading ? (
            <SkeletonTable cols={7} rows={6} />
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📭</div>
              <div className="admin-empty-text">No leads found.</div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} onClick={() => setSelected(l)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'linear-gradient(135deg,#3B82F6,#06B6D4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.8rem', color: '#fff', flexShrink: 0,
                        }}>
                          {(l.client_name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{l.client_name}</div>
                          <div className="td-muted" style={{ fontSize: '0.75rem', color: 'var(--a-muted)' }}>{l.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{l.company || '—'}</td>
                    <td className="td-muted">{l.industry || '—'}</td>
                    <td className="td-muted">{l.budget_range || '—'}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td className="td-muted">{l.source || '—'}</td>
                    <td className="td-muted">{l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSave={(status, notes) =>
            updateLead.mutate({ id: selected.id, status, notes })
          }
          saving={updateLead.isPending}
        />
      )}
    </>
  );
}

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

function SkeletonTable({ cols, rows }) {
  return (
    <div style={{ padding: 16 }}>
      {Array.from({ length: rows }).map((_, i) => (
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