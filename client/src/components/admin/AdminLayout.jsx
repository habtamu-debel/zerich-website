import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { clearToken } from '../../lib/api';
import '../../styles/admin.css';

const NAV = [
  {
    section: 'Overview',
    links: [
      { to: '/admin', end: true, icon: GridIcon, label: 'Dashboard' },
    ],
  },
  {
    section: 'Manage',
    links: [
      { to: '/admin/leads',    icon: UsersIcon,   label: 'Leads' },
      { to: '/admin/projects', icon: FolderIcon,  label: 'Projects' },
      { to: '/admin/training', icon: BookIcon,    label: 'Training' },
    ],
  },
];

export default function AdminLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  function logout() {
    clearToken();
    setUser(null);
    navigate('/admin/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <div className="admin-root">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">Z</div>
          <div>
            <div className="admin-sidebar-name">ZeRich</div>
            <div className="admin-sidebar-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map(group => (
            <div key={group.section}>
              <div className="admin-nav-section">{group.section}</div>
              {group.links.map(({ to, end, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `admin-nav-link${isActive ? ' active' : ''}`
                  }
                >
                  <Icon className="nav-icon" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{initials}</div>
            <div>
              <div className="admin-user-name">{user?.name || 'Admin'}</div>
              <div className="admin-user-role">{user?.role || 'admin'}</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout}>
            <LogoutIcon style={{ width: 15, height: 15 }} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar-title">ZeRich Technologies — Admin</span>
          <div className="admin-topbar-right">
            <span className="admin-topbar-time">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <div className="admin-avatar" style={{ width: 30, height: 30, fontSize: '0.75rem' }}>{initials}</div>
          </div>
        </header>
        <div className="admin-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/* ── Inline SVG Icons ── */
function GridIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function UsersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function FolderIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function BookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
function LogoutIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}