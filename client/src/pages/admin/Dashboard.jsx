import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

async function fetchStats() {
  const res = await api.get('/admin/stats');
  return res.data;
}

const STAT_CARDS = [
  {
    key: 'totalLeads',
    label: 'Total Leads',
    icon: '📋',
    accentVar: '#06B6D4',
    iconBg: 'rgba(6,182,212,0.12)',
  },
  {
    key: 'newLeads',
    label: 'New Leads',
    icon: '🔔',
    accentVar: '#8B5CF6',
    iconBg: 'rgba(139,92,246,0.12)',
  },
  {
    key: 'weekLeads',
    label: 'Leads This Week',
    icon: '📈',
    accentVar: '#3B82F6',
    iconBg: 'rgba(59,130,246,0.12)',
  },
  {
    key: 'totalProjects',
    label: 'Active Projects',
    icon: '🗂️',
    accentVar: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.12)',
  },
  {
    key: 'totalModules',
    label: 'Training Modules',
    icon: '📚',
    accentVar: '#10B981',
    iconBg: 'rgba(16,185,129,0.12)',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
          <p className="admin-page-sub">Here's what's happening with your business today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map(({ key, label, icon, accentVar, iconBg }) => (
          <div
            key={key}
            className="admin-stat-card"
            style={{ '--card-accent': accentVar, '--icon-bg': iconBg }}
          >
            <div className="admin-stat-icon">{icon}</div>
            {isLoading ? (
              <div className="skeleton" style={{ height: 38, width: 80, marginBottom: 8, borderRadius: 6 }} />
            ) : (
              <div className="admin-stat-value">{stats?.[key] ?? 0}</div>
            )}
            <div className="admin-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Nav Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <QuickCard
          title="Lead Management"
          desc="View and manage incoming client inquiries, update status and add notes."
          icon="👥"
          href="/admin/leads"
          accent="#06B6D4"
        />
        <QuickCard
          title="Project Tracker"
          desc="Monitor active client projects, update stages and assign engineers."
          icon="🗂️"
          href="/admin/projects"
          accent="#F59E0B"
        />
        <QuickCard
          title="Training Hub"
          desc="Create and manage training modules, view student enrollments."
          icon="📚"
          href="/admin/training"
          accent="#10B981"
        />
      </div>
    </>
  );
}

function QuickCard({ title, desc, icon, href, accent }) {
  return (
    <a
      href={href}
      className="admin-card"
      style={{
        textDecoration: 'none', display: 'block', padding: 20,
        transition: 'border-color 0.18s, transform 0.18s',
        cursor: 'pointer',
        borderTop: `2px solid ${accent}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = accent; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
    >
      <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--a-text)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--a-muted)', lineHeight: 1.55 }}>{desc}</div>
      <div style={{ marginTop: 14, fontSize: '0.8rem', color: accent, fontWeight: 600 }}>Open →</div>
    </a>
  );
}
