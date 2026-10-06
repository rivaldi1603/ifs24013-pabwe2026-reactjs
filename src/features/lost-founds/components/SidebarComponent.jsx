import { NavLink } from 'react-router-dom';
import { IconDashboard, IconChartBar, IconUsers, IconUserCircle } from '@tabler/icons-react';

function SidebarComponent({ isOpen, closeSidebar }) {
  const menuItems = [
    { name: 'Dashboard Laporan', path: '/', icon: <IconDashboard size={20} /> },
    { name: 'Statistik', path: '/stats', icon: <IconChartBar size={20} /> },
    { name: 'Daftar Pengguna', path: '/users', icon: <IconUsers size={20} /> },
    { name: 'Profil Saya', path: '/profile', icon: <IconUserCircle size={20} /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 w-64 h-screen pt-16 transition-transform bg-white border-r border-slate-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white flex flex-col justify-between">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => closeSidebar()}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="mr-3">{item.icon}</div>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-center text-slate-600">
            &copy; 2026 Delcom Lost & Founds
          </div>
        </div>
      </aside>
    </>
  );
}

export default SidebarComponent;
