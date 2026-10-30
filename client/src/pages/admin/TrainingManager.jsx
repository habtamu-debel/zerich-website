import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import CourseForm from '../../components/admin/CourseForm';
import EnrollmentTable from '../../components/admin/EnrollmentTable';

async function fetchModules() {
  const res = await api.get('/admin/training');
  return res.data;
}

export default function TrainingManager() {
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing]   = useState(null);
  const qc = useQueryClient();

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: fetchModules,
  });

  const createModule = useMutation({
    mutationFn: body => api.post('/admin/training', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['modules'] });
      setShowForm(false);
    },
  });

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Training Modules</h1>
          <p className="admin-page-sub">{modules.length} module{modules.length !== 1 ? 's' : ''} published</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(true)}>
          <PlusIcon style={{ width: 16, height: 16 }} />
          New Module
        </button>
      </div>

      {isLoading ? (
        <SkeletonModules />
      ) : modules.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📚</div>
            <div className="admin-empty-text">No training modules yet. Create your first one.</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {modules.map(m => (
            <ModuleCard key={m.id} module={m} onViewEnrollments={() => setViewing(m.id)} />
          ))}
        </div>
      )}

      {showForm && (
        <CourseForm
          onClose={() => setShowForm(false)}
          onSave={body => createModule.mutate(body)}
          saving={createModule.isPending}
        />
      )}
      {viewing && (
        <EnrollmentTable moduleId={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  );
}

function ModuleCard({ module: m, onViewEnrollments }) {
  let links = [];
  try { links = JSON.parse(m.lesson_links || '[]'); } catch {}

  return (
    <div className="admin-card" style={{ padding: 20, transition: 'transform 0.18s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))',
          border: '1px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
        }}>
          📚
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--a-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {m.title}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--a-muted)', marginTop: 2 }}>
            {links.length} lesson{links.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--a-muted2)', lineHeight: 1.55, marginBottom: 14,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {m.description || 'No description provided.'}
      </p>

      {links.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--a-muted)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Lessons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {links.slice(0, 3).map((l, i) => (
              <a key={i} href={l} target="_blank" rel="noreferrer"
                style={{ fontSize: '0.76rem', color: 'var(--a-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🔗 {l}
              </a>
            ))}
            {links.length > 3 && <span style={{ fontSize: '0.72rem', color: 'var(--a-muted)' }}>+{links.length - 3} more</span>}
          </div>
        </div>
      )}

      <button
        className="admin-btn admin-btn-ghost admin-btn-sm"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={onViewEnrollments}
      >
        View Enrollments
      </button>
    </div>
  );
}

function SkeletonModules() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 200, borderRadius: 12 }} />
      ))}
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}