import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import SideMenu from '../components/layout/SideMenu';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080b14' }}>
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Sidebar */}
      <SideMenu />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar />
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: '28px 32px' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
