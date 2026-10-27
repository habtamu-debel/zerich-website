import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const tabs = [
    { to: '/admin/leads', label: 'Leads' },
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/training', label: 'Training' },
  ];
  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <aside className="w-56 border-r border-white/10 p-4 space-y-2">
        {tabs.map(t => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg ${isActive ? 'bg-cyan-600/20 text-cyan-300' : 'hover:bg-white/5'}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-6"><Outlet /></main>
    </div>
  );
}