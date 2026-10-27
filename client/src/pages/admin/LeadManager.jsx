// client/src/pages/admin/LeadManager.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

async function fetchLeads(filters) {
  const res = await api.get('/admin/leads', { params: filters });
  return res.data;
}

export default function LeadManager() {
  const [filters, setFilters] = useState({ status: '', industry: '' });
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => fetchLeads(filters),
  });

  const updateLead = useMutation({
  mutationFn: ({ id, status, notes }) => api.patch(`/admin/leads/${id}`, { status, notes }),
  onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); setSelected(null); },
});

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>

      <div className="flex gap-3 mb-4">
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2"
        >
          <option value="">All statuses</option>
          {['new', 'contacted', 'qualified', 'won', 'lost'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          placeholder="Industry"
          value={filters.industry}
          onChange={e => setFilters(f => ({ ...f, industry: e.target.value }))}
          className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2"
        />
      </div>

      {isLoading ? (
        <SkeletonRows />
      ) : (
        <table className="w-full text-sm">
          <thead className="text-slate-400 text-left border-b border-white/10">
            <tr>
              <th className="py-2">Client</th><th>Company</th><th>Industry</th>
              <th>Budget</th><th>Status</th><th>Source</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(l => (
              <tr
                key={l.id}
                onClick={() => setSelected(l)}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
              >
                <td className="py-2">{l.client_name}</td>
                <td>{l.company}</td>
                <td>{l.industry}</td>
                <td>{l.budget_range}</td>
                <td><StatusBadge status={l.status} /></td>
                <td>{l.source}</td>
                <td>{new Date(l.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSave={(status, notes) => updateLead.mutate({ id: selected.id, status, notes })}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    new: 'bg-cyan-500/20 text-cyan-300',
    contacted: 'bg-blue-500/20 text-blue-300',
    qualified: 'bg-indigo-500/20 text-indigo-300',
    won: 'bg-emerald-500/20 text-emerald-300',
    lost: 'bg-red-500/20 text-red-300',
  };
  return <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>{status}</span>;
}

function SkeletonRows() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}