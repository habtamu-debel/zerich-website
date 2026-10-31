import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import api from '../../lib/api';
import LeadDrawer from '../../components/admin/LeadDrawer';
import { STATUSES, STATUS_STYLES } from '../../components/admin/leadStatus';

const fmtDate = (s) =>
  new Date(String(s).replace(' ', 'T')).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

export default function LeadManager() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();

  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get('/admin/leads').then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: ({ id, status, notes }) => api.patch(`/admin/leads/${id}`, { status, notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      setSelected(null);
    },
  });

  const counts = useMemo(() => {
    const c = { all: leads.length };
    STATUSES.forEach((s) => { c[s] = leads.filter((l) => l.status === s).length; });
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (tab === 'all' || l.status === tab) &&
        (!q || [l.name, l.email, l.service, l.phone].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [leads, tab, search]);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-sm text-slate-400 mt-1">
          Enquiries from your contact form and consultation requests.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
        <div className="flex flex-wrap gap-2">
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`px-3.5 py-1.5 rounded-full text-sm capitalize transition ring-1 ${
                tab === s
                  ? 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/40'
                  : 'text-slate-400 ring-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              {s} <span className="ml-1 text-xs opacity-70">{counts[s]}</span>
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, service…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/60"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-slate-400 bg-white/[0.04]">
              <tr>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-5 py-4">
                      <div className="h-8 rounded-lg bg-white/5 animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!isLoading && isError && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-red-300">
                  Could not load leads. Check that the server is running.
                </td></tr>
              )}

              {!isLoading && !isError && visible.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  {leads.length ? 'No leads match your filters.' : 'No leads yet.'}
                </td></tr>
              )}

              {visible.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => setSelected(l)}
                  className="cursor-pointer hover:bg-white/[0.04] transition"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                        {l.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{l.name}</p>
                        <p className="text-xs text-slate-400 truncate">{l.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{l.service || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs capitalize ring-1 ${STATUS_STYLES[l.status] || ''}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{fmtDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <LeadDrawer
          lead={selected}
          saving={save.isPending}
          onClose={() => setSelected(null)}
          onSave={(status, notes) => save.mutate({ id: selected.id, status, notes })}
        />
      )}
    </div>
  );
}