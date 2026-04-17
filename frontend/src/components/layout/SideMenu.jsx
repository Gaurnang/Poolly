import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  Bookmark,
  CheckSquare,
  BarChart3,
  Zap,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Create Poll', icon: PlusCircle, to: '/create-poll', highlight: true },
  { label: 'My Polls', icon: ListChecks, to: '/my-polls' },
  { label: 'Voted Polls', icon: CheckSquare, to: '/voted-polls' },
  { label: 'Bookmarked', icon: Bookmark, to: '/bookmarked' },
];

const statItems = [
  { key: 'totalPollsCreated', label: 'Created', color: '#a78bfa' },
  { key: 'totalPollsVotes', label: 'Voted', color: '#06b6d4' },
  { key: 'totalPollsBooked', label: 'Saved', color: '#10b981' },
];

export default function SideMenu() {
  const { user } = useUser();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 relative z-20"
      style={{
        width: '260px',
        background: 'rgba(8, 11, 20, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6"
        style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
          }}
        >
          <BarChart3 size={18} color="white" />
        </div>
        <div>
          <span
            style={{
              fontWeight: 900,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Poolly
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {/* Section label */}
        <p
          className="px-3 mb-2"
          style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4d607e' }}
        >
          Main Menu
        </p>

        {navItems.map(({ label, icon: Icon, to, highlight }) => (
          <NavLink
            key={to}
            to={to}
            id={`sidenav-${label.toLowerCase().replace(' ', '-')}`}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''} ${highlight && !false ? 'nav-highlight' : ''}`
            }
            style={({ isActive }) => highlight && !isActive ? {
              background: 'rgba(124, 58, 237, 0.08)',
              border: '1px solid rgba(124, 58, 237, 0.18)',
              color: '#a78bfa',
              marginTop: '4px',
              marginBottom: '4px',
            } : {}}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
            {/* {highlight && (
              <span
                className="ml-auto"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  padding: '2px 7px',
                  borderRadius: '99px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.05em',
                }}
              >
                NEW
              </span> */}
            {/* )} */}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="px-3 pb-4">
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '14px',
          }}
        >
          {/* User info */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e8edf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                @{user?.username}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#4d607e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {statItems.map(({ key, label, color }) => (
              <div
                key={key}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.875rem', fontWeight: 800, color }}>{user?.[key] ?? 0}</p>
                <p style={{ fontSize: '0.625rem', color: '#4d607e', marginTop: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
