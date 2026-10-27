// client/src/components/admin/ProjectDrawer.jsx
import { useState } from 'react';

export default function ProjectDrawer({ project, stages, onClose, onSave }) {
  const [stage, setStage] = useState(project.stage);
  const [stagingUrl, setStagingUrl] = useState(project.staging_url || '');
  const [engineer, setEngineer] = useState(project.lead_engineer || '');
  const [deployDate, setDeployDate] = useState(project.deployment_date?.slice(0, 10) || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-96 bg-slate-900 border-l border-white/10 p-6 h-full overflow-y-auto">
        <button onClick={onClose} className="text-slate-400 mb-4">&larr; Close</button>
        <h2 className="text-xl font-semibold mb-4">{project.client_name}</h2>

        <label className="block text-sm text-slate-400 mb-1">Stage</label>
        <select value={stage} onChange={e => setStage(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-4">
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <label className="block text-sm text-slate-400 mb-1">Staging URL</label>
        <input value={stagingUrl} onChange={e => setStagingUrl(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-4" />

        <label className="block text-sm text-slate-400 mb-1">Lead Engineer</label>
        <input value={engineer} onChange={e => setEngineer(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-4" />

        <label className="block text-sm text-slate-400 mb-1">Deployment Date</label>
        <input type="date" value={deployDate} onChange={e => setDeployDate(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 mb-4" />

        <button
          onClick={() => onSave({ stage, staging_url: stagingUrl, lead_engineer: engineer, deployment_date: deployDate })}
          className="w-full bg-cyan-600 hover:bg-cyan-500 rounded-lg py-2 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
}