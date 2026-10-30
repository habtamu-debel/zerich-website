import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import ProjectDrawer from '../../components/admin/ProjectDrawer';

const STAGES = [
  'Discovery & Requirements',
  'System Architecture',
  'Full-Stack Development',
  'UAT & Testing',
  'Deployment',
];

const STAGE_COLORS = {
  'Discovery & Requirements': '#F59E0B',
  'System Architecture':      '#8B5CF6',
  'Full-Stack Development':   '#3B82F6',
  'UAT & Testing':            '#06B6D4',
  'Deployment':               '#10B981',
};

async function fetchProjects() {
  const res = await api.get('/admin/projects');
  return res.data;
}

export default function ProjectManager() {
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const updateProject = useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`/admin/projects/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      setEditing(null);
    },
  });

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-sub">{projects.length} active client projects</p>
        </div>
      </div>

      {/* Stage pipeline summary */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {STAGES.map(s => {
          const count = projects.filter(p => p.stage === s).length;
          const color = STAGE_COLORS[s];
          return (
            <div key={s} style={{
              background: 'var(--a-surface)', border: `1px solid var(--a-border)`,
              borderTop: `2px solid ${color}`,
              borderRadius: 10, padding: '10px 14px', minWidth: 130,
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{count}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--a-muted)', marginTop: 2, lineHeight: 1.3 }}>{s}</div>
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : projects.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">🗂️</div>
            <div className="admin-empty-text">No projects yet.</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              stages={STAGES}
              stageColors={STAGE_COLORS}
              onEdit={() => setEditing(p)}
            />
          ))}
        </div>
      )}

      {editing && (
        <ProjectDrawer
          project={editing}
          stages={STAGES}
          onClose={() => setEditing(null)}
          onSave={body => updateProject.mutate({ id: editing.id, ...body })}
          saving={updateProject.isPending}
        />
      )}
    </>
  );
}

function ProjectCard({ project: p, stages, stageColors, onEdit }) {
  const stageIdx = stages.indexOf(p.stage);
  const pct = stageIdx === -1 ? 0 : Math.round(((stageIdx + 1) / stages.length) * 100);
  const color = stageColors[p.stage] || '#06B6D4';

  return (
    <div className="admin-card" style={{ padding: 20, transition: 'transform 0.18s, border-color 0.18s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg, ${color}33, ${color}55)`,
            border: `1px solid ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.9rem', color,
          }}>
            {(p.client_name || '?')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--a-text)' }}>{p.client_name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--a-muted)' }}>
              {p.deployment_date
                ? `Deploy: ${new Date(p.deployment_date).toLocaleDateString()}`
                : 'No deploy date'}
            </div>
          </div>
        </div>
        <span className="stage-pill" style={{ background: `${color}22`, color }}>{p.stage ? p.stage.split(' ')[0] : '—'}</span>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--a-muted)', marginBottom: 5 }}>
          <span>Progress</span><span style={{ color }}>{pct}%</span>
        </div>
        <div className="admin-progress-bar-wrap">
          <div className="admin-progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }} />
        </div>
      </div>

      {/* Stage label */}
      <div style={{ fontSize: '0.78rem', color: 'var(--a-muted2)', marginBottom: 14 }}>
        <strong style={{ color: 'var(--a-muted)' }}>Stage: </strong>{p.stage || 'Not set'}
      </div>

      {/* Engineer */}
      <div style={{ fontSize: '0.78rem', color: 'var(--a-muted)', marginBottom: 14 }}>
        👷 {p.lead_engineer || <em>Unassigned</em>}
      </div>

      {p.staging_url && (
        <a
          href={p.staging_url} target="_blank" rel="noreferrer"
          style={{ display: 'inline-block', fontSize: '0.75rem', color: 'var(--a-cyan)', marginBottom: 14 }}
          onClick={e => e.stopPropagation()}
        >
          🔗 Staging link
        </a>
      )}

      <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={onEdit}>
        Update Project
      </button>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 220, borderRadius: 12 }} />
      ))}
    </div>
  );
}