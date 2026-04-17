import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Lock, Trash2, PlusCircle, AlertTriangle, Users, Calendar, ChevronDown } from 'lucide-react';
import { getMyPolls, closePoll, openPoll, deletePoll } from '../utils/api';
import PollResultContent from '../components/polls/PollResultContent';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TYPE_THEMES = {
  'single-choice': { color: '#a78bfa', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
  'yes/no':        { color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  'rating':        { color: '#fcd34d', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  'open-ended':    { color: '#f9a8d4', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
  'image-based':   { color: '#c4b5fd', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
};

const cardStyle = {
  background: 'rgba(15, 22, 45, 0.8)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
  overflow: 'hidden',
};

export default function MyPollsPage() {
  const [polls, setPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedPolls, setExpandedPolls] = useState({});

  const fetchPolls = useCallback(async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const res = await getMyPolls(pageNum);
      const newPolls = res.data.polls;
      setPolls(prev => reset ? newPolls : [...prev, ...newPolls]);
      setHasMore(res.data.hasMore);
    } catch {
      toast.error('Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPolls(1, true); }, [fetchPolls]);

  const handleClose = async (id) => {
    setActionLoading(id + '-close');
    try {
      await closePoll(id);
      setPolls(prev => prev.map(p => p._id === id ? { ...p, isClosed: true } : p));
      toast.success('Poll closed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close poll');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpen = async (id) => {
    setActionLoading(id + '-open');
    try {
      await openPoll(id);
      setPolls(prev => prev.map(p => p._id === id ? { ...p, isClosed: false } : p));
      toast.success('Poll unlocked');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unlock poll');
    } finally {
      setActionLoading(null);
    }
  };


  const handleDelete = async (id) => {
    setActionLoading(id + '-delete');
    try {
      await deletePoll(id);
      setPolls(prev => prev.filter(p => p._id !== id));
      setConfirmDelete(null);
      toast.success('Poll deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete poll');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedPolls(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fade-up">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e8edf8', letterSpacing: '-0.02em' }}>My Polls</h1>
          <p style={{ fontSize: '0.875rem', color: '#8899b8', marginTop: '4px' }}>
            Manage and monitor your created polls
          </p>
        </div>
        <Link
          to="/create-poll"
          className="btn btn-primary"
          style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '0.875rem' }}
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">New Poll</span>
        </Link>
      </div>

      {/* Content */}
      {loading && polls.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : polls.length === 0 ? (
        /* Empty state */
        <div
          style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'rgba(15,22,45,0.5)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
          }}
        >
          <div
            style={{
              width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 20px',
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <BarChart3 size={28} color="#7c3aed" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#e8edf8', marginBottom: '8px' }}>No polls yet</h3>
          <p style={{ fontSize: '0.875rem', color: '#8899b8', marginBottom: '24px' }}>
            Create your first poll and start gathering responses
          </p>
          <Link to="/create-poll" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '10px' }}>
            <PlusCircle size={16} />
            Create Poll
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {polls.map(poll => {
            const theme = TYPE_THEMES[poll.type] || TYPE_THEMES['single-choice'];
            const isExpanded = expandedPolls[poll._id];
            return (
              <div key={poll._id} style={cardStyle}>
                {/* Poll header */}
                <div style={{ padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    {/* Main info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Badges row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {/* Status badge */}
                        {poll.isClosed ? (
                          <span
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              padding: '3px 10px', borderRadius: '99px',
                              fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171',
                            }}
                          >
                            <Lock size={9} /> Closed
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              padding: '3px 10px', borderRadius: '99px',
                              fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                            Active
                          </span>
                        )}
                        {/* Type badge */}
                        <span
                          style={{
                            padding: '3px 10px', borderRadius: '99px',
                            fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                            background: theme.bg, border: `1px solid ${theme.border}`, color: theme.color,
                          }}
                        >
                          {poll.type}
                        </span>
                      </div>

                      {/* Question */}
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e8edf8', lineHeight: 1.4, marginBottom: '8px' }}>
                        {poll.question}
                      </h3>

                      {/* Meta */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#4d607e' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={12} />
                          {poll.totalVotes} votes
                        </span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {new Date(poll.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {!poll.isClosed ? (
                        <button
                          id={`close-poll-${poll._id}`}
                          onClick={() => handleClose(poll._id)}
                          disabled={actionLoading === poll._id + '-close'}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '7px 12px', borderRadius: '9px',
                            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                            color: '#fcd34d', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                            transition: 'all 0.2s', opacity: actionLoading === poll._id + '-close' ? 0.6 : 1,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.18)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; }}
                        >
                          {actionLoading === poll._id + '-close' ? (
                            <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid rgba(245,158,11,0.3)', borderTopColor: '#f59e0b', borderRadius: '50%' }} />
                          ) : <Lock size={13} />}
                          Close
                        </button>
                      ) : (
                        <button
                          id={`open-poll-${poll._id}`}
                          onClick={() => handleOpen(poll._id)}
                          disabled={actionLoading === poll._id + '-open'}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '7px 12px', borderRadius: '9px',
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                            color: '#6ee7b7', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                            transition: 'all 0.2s', opacity: actionLoading === poll._id + '-open' ? 0.6 : 1,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.18)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; }}
                        >
                          {actionLoading === poll._id + '-open' ? (
                            <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid rgba(16,185,129,0.3)', borderTopColor: '#10b981', borderRadius: '50%' }} />
                          ) : <Lock size={13} style={{ transform: 'rotateY(180deg)', opacity: 0.8 }} />}
                          Unlock
                        </button>
                      )}
                      <button
                        id={`delete-poll-${poll._id}`}
                        onClick={() => setConfirmDelete(poll._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '7px 12px', borderRadius: '9px',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          color: '#f87171', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results section */}
                {poll.totalVotes > 0 && (
                  <>
                    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
                    <div style={{ padding: '0 22px' }}>
                      <button
                        onClick={() => toggleExpand(poll._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '12px 0', width: '100%', textAlign: 'left',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '0.8125rem', color: '#8899b8', fontWeight: 600,
                        }}
                      >
                        <BarChart3 size={14} style={{ color: '#7c3aed' }} />
                        Results ({poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'})
                        <ChevronDown
                          size={14}
                          style={{ marginLeft: 'auto', color: '#4d607e', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                        />
                      </button>
                      {isExpanded && (
                        <div style={{ paddingBottom: '18px' }} className="fade-in">
                          <PollResultContent poll={poll} />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => { const next = page + 1; setPage(next); fetchPolls(next); }}
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', cursor: 'pointer',
                fontSize: '0.875rem', color: '#8899b8', fontWeight: 600,
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e8edf8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#8899b8'; }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#8899b8', borderRadius: '50%' }} />
                  Loading...
                </>
              ) : 'Load More'}
            </button>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '20px',
          }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="fade-up"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0f1623',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '360px',
              width: '100%',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <AlertTriangle size={20} color="#f87171" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e8edf8' }}>Delete Poll?</h3>
                <p style={{ fontSize: '0.75rem', color: '#4d607e', marginTop: '2px' }}>This action cannot be undone</p>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#8899b8', lineHeight: 1.6, marginBottom: '24px' }}>
              All votes and responses for this poll will be permanently removed.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#8899b8', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e8edf8'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8899b8'; }}
              >
                Cancel
              </button>
              <button
                id="confirm-delete"
                onClick={() => handleDelete(confirmDelete)}
                disabled={actionLoading?.includes('delete')}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  border: 'none', color: '#fff', cursor: 'pointer',
                  fontSize: '0.875rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
                  transition: 'all 0.2s', opacity: actionLoading?.includes('delete') ? 0.6 : 1,
                }}
              >
                {actionLoading?.includes('delete') ? (
                  <div className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                ) : (
                  <>
                    <Trash2 size={14} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
