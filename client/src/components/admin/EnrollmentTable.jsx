import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function EnrollmentTable({ moduleId, onClose }) {
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['enrollments', moduleId],
    queryFn: () =>
      api.get(`/admin/training/${moduleId}/enrollments`).then(r => r.data),
  });

  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal" style={{ maxWidth: 600 }}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">Enrollments</div>
          <button className="admin-drawer-close" onClick={onClose}>
            <CloseIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {isLoading ? (
          <div className="skeleton" style={{ height: 120, borderRadius: 8 }} />
        ) : enrollments.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">👥</div>
            <div className="admin-empty-text">No enrollments yet for this module.</div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e.id} style={{ cursor: 'default' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: 'linear-gradient(135deg,#8B5CF6,#3B82F6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.75rem', color: '#fff', flexShrink: 0,
                        }}>
                          {(e.full_name || '?')[0].toUpperCase()}
                        </div>
                        {e.full_name}
                      </div>
                    </td>
                    <td className="td-muted">{e.email}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="admin-progress-bar-wrap" style={{ flex: 1 }}>
                          <div className="admin-progress-bar" style={{ width: `${e.progress_pct ?? 0}%` }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--a-cyan)', width: 32, textAlign: 'right' }}>
                          {e.progress_pct ?? 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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