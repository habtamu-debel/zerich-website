import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { STAGES } from './projectStages';

const input =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/60';
const label = 'block text-xs uppercase tracking-wider text-slate-500 mb-1.5';

export default function ProjectForm({ project, saving, error, onClose, onSave }) {
  const [f, setF] = useState({
    name: project.name || '',
    client_name: project.client_name || '',
    description: project.description || '',
    stage: project.stage || STAGES[0],
    staging_url: project.staging_url || '',
    lead_engineer: project.lead_engineer || '',
    deployment_date: project.deployment_date || '',
  });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={(e) => { e.preventDefault(); onSave(f); }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1120] p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-xl font-semibold text-white">
            {project.id ? 'Edit Project' : 'New Project'}
          </p>
          <button type="button" onClick={onClose} aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Project name</label>
              <input className={input} value={f.name} onChange={set('name')} placeholder="Pharmacy ERP" required />
            </div>
            <div>
              <label className={label}>Client</label>
              <input className={input} value={f.client_name} onChange={set('client_name')} placeholder="Client or company" required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Stage</label>
              <select className={input} value={f.stage} onChange={set('stage')}>
                {STAGES.map((s) => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Lead engineer</label>
              <input className={input} value={f.lead_engineer} onChange={set('lead_engineer')} placeholder="Assign an engineer" />
            </div>
          </div>

          <div>
            <label className={label}>Staging URL</label>
            <input className={input} type="url" value={f.staging_url} onChange={set('staging_url')} placeholder="https://staging.example.com" />
          </div>

          <div>
            <label className={label}>Target deployment date</label>
            <input className={input} type="date" value={f.deployment_date} onChange={set('deployment_date')} />
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea className={input} rows={3} value={f.description} onChange={set('description')} placeholder="Scope, modules, notes…" />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-lg ring-1 ring-white/10 py-2.5 text-sm text-slate-300 hover:bg-white/5">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {saving ? 'Saving…' : project.id ? 'Save changes' : 'Create project'}
          </button>
        </div>
      </form>
    </div>
  );
}