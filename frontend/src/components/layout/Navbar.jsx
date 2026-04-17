import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Bell, Search, LogOut, ChevronDown, AtSign, Check, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { logoutUser, updateUsername } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, updateUser } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openUsernameModal = () => {
    setNewUsername(user?.username || '');
    setUsernameError('');
    setShowDropdown(false);
    setShowUsernameModal(true);
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    const trimmed = newUsername.trim();
    if (!trimmed) { setUsernameError('Username cannot be empty'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) { setUsernameError('Only letters, numbers, underscores'); return; }
    if (trimmed.length < 3) { setUsernameError('At least 3 characters'); return; }
    if (trimmed === user?.username) { setShowUsernameModal(false); return; }

    setUsernameLoading(true);
    setUsernameError('');
    try {
      const res = await updateUsername({ username: trimmed });
      updateUser({ ...user, ...res.data.user, username: trimmed, fullName: trimmed });
      toast.success('Username updated!');
      setShowUsernameModal(false);
    } catch (err) {
      setUsernameError(err.response?.data?.message || 'Failed to update username');
    } finally {
      setUsernameLoading(false);
    }
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <>
      <header
        className="flex items-center justify-between px-8 shrink-0 relative z-20"
        style={{
          height: '64px',
          background: 'rgba(8, 11, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Left: mobile logo + search */}
        <div className="flex items-center gap-4">
          <div className="flex lg:hidden items-center gap-2">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={16} color="white" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Poolly</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
       
          {/* User dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              id="navbar-user-menu"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '6px 12px 6px 6px',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e8edf8', lineHeight: 1.2 }}>@{user?.username}</p>
                <p style={{ fontSize: '0.7rem', color: '#4d607e', marginTop: '1px' }}>{user?.email}</p>
              </div>
              <ChevronDown size={14} style={{ color: '#4d607e', transition: 'transform 0.2s ease', transform: showDropdown ? 'rotate(180deg)' : 'none' }} />
            </button>

            {showDropdown && (
              <div
                className="fade-in"
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '220px', background: '#0f1623',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px',
                  overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)', zIndex: 50,
                }}
              >
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e8edf8' }}>@{user?.username}</p>
                  <p style={{ fontSize: '0.75rem', color: '#4d607e', marginTop: '2px' }}>{user?.email}</p>
                </div>
                <div style={{ padding: '6px' }}>
                  {/* Change username */}
                  <button
                    id="navbar-change-username"
                    onClick={openUsernameModal}
                    className="w-full flex items-center gap-3"
                    style={{
                      padding: '10px 12px', borderRadius: '8px',
                      fontSize: '0.875rem', color: '#8899b8',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s', textAlign: 'left', fontWeight: 500,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e8edf8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8899b8'; }}
                  >
                    <AtSign size={15} />
                    Change Username
                  </button>

                  {/* Logout */}
                  <button
                    id="navbar-logout"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3"
                    style={{
                      padding: '10px 12px', borderRadius: '8px',
                      fontSize: '0.875rem', color: '#f87171',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s', textAlign: 'left', fontWeight: 500,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Username Modal */}
      {showUsernameModal && (
        <div
          className="fade-in"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
          onClick={() => setShowUsernameModal(false)}
        >
          <div
            className="fade-up"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0f1623', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '20px',
              padding: '28px', maxWidth: '380px', width: '100%',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AtSign size={17} color="#a78bfa" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e8edf8' }}>Change Username</h3>
                  <p style={{ fontSize: '0.75rem', color: '#4d607e', marginTop: '2px' }}>Current: @{user?.username}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUsernameModal(false)}
                style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8899b8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUsernameChange}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#c4cfe4', marginBottom: '8px' }}>
                  New Username
                </label>
                <div style={{ position: 'relative' }}>
                  <AtSign size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4d607e' }} />
                  <input
                    id="change-username-input"
                    type="text"
                    value={newUsername}
                    onChange={e => { setNewUsername(e.target.value); setUsernameError(''); }}
                    placeholder="Enter new username"
                    autoFocus
                    className="input-field"
                    style={{
                      width: '100%', paddingLeft: '38px', paddingRight: '16px',
                      paddingTop: '11px', paddingBottom: '11px', borderRadius: '10px',
                      borderColor: usernameError ? 'rgba(239,68,68,0.5)' : undefined,
                    }}
                  />
                </div>
                {usernameError && (
                  <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '6px' }}>{usernameError}</p>
                )}
                <p style={{ fontSize: '0.75rem', color: '#4d607e', marginTop: '6px' }}>
                  Letters, numbers and underscores only. Min. 3 characters.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUsernameModal(false)}
                  style={{
                    flex: 1, padding: '11px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#8899b8', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  id="change-username-submit"
                  type="submit"
                  disabled={usernameLoading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '0.875rem' }}
                >
                  {usernameLoading ? (
                    <div className="spinner" style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  ) : (
                    <>
                      <Check size={15} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
