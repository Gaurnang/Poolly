import { useState, useEffect, useCallback } from 'react';
import { CheckSquare, BarChart3, Users, Calendar } from 'lucide-react';
import { getVotedPolls } from '../utils/api';
import PollResultContent from '../components/polls/PollResultContent';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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

export default function VotedPollsPage() {
  const [polls, setPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchPolls = useCallback(async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const res = await getVotedPolls(pageNum);
      setPolls(prev => reset ? res.data.polls : [...prev, ...res.data.polls]);
      setHasMore(res.data.hasMore);
    } catch {
      toast.error('Failed to fetch voted polls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPolls(1, true); }, [fetchPolls]);

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(6,182,212,0.3)',
            }}
          >
            <CheckSquare size={18} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e8edf8', letterSpacing: '-0.02em' }}>
            Voted Polls
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#8899b8', marginLeft: '48px' }}>
          Polls you've participated in — view your vote history
        </p>
      </div>

      {/* Content */}
      {loading && polls.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : polls.length === 0 ? (
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
              background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <CheckSquare size={28} color="#06b6d4" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#e8edf8', marginBottom: '8px' }}>No votes yet</h3>
          <p style={{ fontSize: '0.875rem', color: '#8899b8', marginBottom: '24px' }}>
            Start voting on polls to see your history here
          </p>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '10px' }}>
            Browse Polls
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {polls.map(poll => {
            const theme = TYPE_THEMES[poll.type] || TYPE_THEMES['single-choice'];
            return (
              <div key={poll._id} style={cardStyle}>
                <div style={{ padding: '20px 22px' }}>
                  {/* Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '99px',
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                        background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9',
                      }}
                    >
                      ✓ Voted
                    </span>
                    <span
                      style={{
                        padding: '3px 10px', borderRadius: '99px',
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                        background: theme.bg, border: `1px solid ${theme.border}`, color: theme.color,
                      }}
                    >
                      {poll.type}
                    </span>
                    {poll.isClosed && (
                      <span
                        style={{
                          padding: '3px 10px', borderRadius: '99px',
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171',
                        }}
                      >
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Question */}
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e8edf8', lineHeight: 1.4, marginBottom: '8px' }}>
                    {poll.question}
                  </h3>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: '#4d607e' }}>
                    <span>
                      by <span style={{ color: '#7c3aed', fontWeight: 600 }}>@{poll.createdBy?.username}</span>
                    </span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} />
                      {poll.totalVotes} total votes
                    </span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {new Date(poll.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Results */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '18px 22px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4d607e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BarChart3 size={11} color="#7c3aed" />
                    Results
                  </p>
                  <PollResultContent poll={poll} />
                </div>
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
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', cursor: 'pointer',
                fontSize: '0.875rem', color: '#8899b8', fontWeight: 600,
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e8edf8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#8899b8'; }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
