import { useState } from 'react';

export default function ProjectDrawer({ project, stages, onClose, onSave, saving }) {
  const [stage, setStage]           = useState(project.stage || stages[0]);
  const [stagingUrl, setStagingUrl] = useState(project.staging_url || '');
  const [engineer, setEngineer]     = useState(project.lead_engineer || '');
  const [deployDate, setDeployDate] = useState(project.deployment_date?.slice(0, 10) || '');

  return (
    <div className="admin-drawer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-drawer">
        <div className="admin-drawer-header">
          <div>
            <div className="admin-drawer-title">{project.client_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--a-muted)', marginTop: 2 }}>
              Update project details
            </div>
          </div>
          <button className="admin-drawer-close" onClick={onClose}>
            <CloseIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Current Stage</label>
          <select className="admin-select" value={stage} onChange={e => setStage(e.target.value)}>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Lead Engineer</label>
          <input
            className="admin-input"
            value={engineer}
            onChange={e => setEngineer(e.target.value)}
            placeholder="Engineer name"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Staging URL</label>
          <input
            className="admin-input"
            value={stagingUrl}
            onChange={e => setStagingUrl(e.target.value)}
            placeholder="https://staging.example.com"
            type="url"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Deployment Date</label>
          <input
            className="admin-input"
            type="date"
            value={deployDate}
            onChange={e => setDeployDate(e.target.value)}
          />
        </div>

        <hr className="admin-divider" />

        <button
          className="admin-btn admin-btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          onClick={() => onSave({ stage, staging_url: stagingUrl, lead_engineer: engineer, deployment_date: deployDate })}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
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