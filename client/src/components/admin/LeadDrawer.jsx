import { useEffect, useState } from 'react';
import { X, Mail, Phone } from 'lucide-react';
import { STATUSES, STATUS_STYLES } from './leadStatus';

export default function LeadDrawer({ lead, saving, onClose, onSave }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.admin_notes || '');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasPhone = /\d{5,}/.test(lead.phone || '');
  const received = new Date(String(lead.created_at).replace(' ', 'T')).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative w-full max-w-md h-full bg-[#0b1120] border-l border-white/10 flex flex-col shadow-2xl">
        <header className="flex items-start justify-between gap-4 p-6 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
              {lead.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-white truncate">{lead.name}</p>
              <p className="text-sm text-slate-400 truncate">{lead.email}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex gap-2">
            <a
              href={`mailto:${lead.email}?subject=${encodeURIComponent('Re: your enquiry to ZeRich Technologies')}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 py-2 text-sm text-white"
            >
              <Mail size={16} /> Email
            </a>
            {hasPhone && (
              <a
                href={`tel:${lead.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 py-2 text-sm text-white"
              >
                <Phone size={16} /> Call
              </a>
            )}
          </div>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Phone</dt>
              <dd className="text-slate-200">{lead.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Service</dt>
              <dd className="text-slate-200">{lead.service || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Message</dt>
              <dd className="text-slate-200 whitespace-pre-wrap rounded-lg bg-white/[0.04] p-3">{lead.message || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500 mb-1">Received</dt>
              <dd className="text-slate-200">{received}</dd>
            </div>
          </dl>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Status</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2 rounded-lg text-sm capitalize ring-1 transition ${
                    status === s ? STATUS_STYLES[s] : 'text-slate-400 ring-white/10 hover:bg-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Internal notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Call summary, quote sent, next steps…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/60"
            />
          </div>
        </div>

        <footer className="p-6 border-t border-white/10 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-lg ring-1 ring-white/10 py-2.5 text-sm text-slate-300 hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={() => onSave(status, notes)}
            disabled={saving}
            className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </footer>
      </aside>
    </div>
  );
}