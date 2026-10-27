// client/src/components/admin/LeadDrawer.jsx
import { useState } from 'react';

export default function LeadDrawer({ lead, onClose, onSave }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.admin_notes || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-96 bg-slate-900 border-l border-white/10 p-6 h-full overflow-y-auto">
        <button onClick={onClose} className="text-slate-400 mb-4">&larr; Close</button>
        <h2 className="text-xl font-semibold">{lead.client_name}</h2>
        <p className="text-slate-400 mb-4">{lead.company}</p>

        <dl className="space-y-2 text-sm mb-6">
          <div><dt className="text-slate-500">Email</dt><dd>{lead.email}</dd></div>
          <div><dt className="text-slate-500">Phone</dt><dd>{lead.phone}</dd></div>
          <div><dt className="text-slate-500">Industry</dt><dd>{lead.industry}</dd></div>
          <div><dt className="text-slate-500">Budget</dt><dd>{lead.budget_range}</dd></div>
          <div><dt className="text-slate-500">Systems</dt><dd>{JSON.parse(lead.required_systems || '[]').join(', ')}</dd></div>
        </dl>

        <label className="block text-sm text-slate-400 mb-1">Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-4"
        >
          {['new', 'contacted', 'qualified', 'won', 'lost'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label className="block text-sm text-slate-400 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-4"
        />

        <button
          onClick={() => onSave(status, notes)}
          className="w-full bg-cyan-600 hover:bg-cyan-500 rounded-lg py-2 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
}