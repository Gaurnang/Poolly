import { TrendingUp, BarChart3, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTrendingPolls } from '../../utils/api';

const TYPE_THEMES = {
  'single-choice': { color: '#a78bfa', bg: 'rgba(124,58,237,0.12)' },
  'yes/no':        { color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)' },
  'rating':        { color: '#fcd34d', bg: 'rgba(245,158,11,0.12)' },
  'open-ended':    { color: '#f9a8d4', bg: 'rgba(236,72,153,0.12)' },
  'image-based':   { color: '#c4b5fd', bg: 'rgba(139,92,246,0.12)' },
};

export default function TrendingPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingPolls()
      .then(res => setPolls(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        background: 'rgba(15, 22, 45, 0.7)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '18px',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #ec4899, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
            flexShrink: 0,
          }}
        >
          <Flame size={16} color="white" />
        </div>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e8edf8' }}>Trending Now</h3>
          <p style={{ fontSize: '0.7rem', color: '#4d607e' }}>Most voted this week</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '10px' }} />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: '#4d607e', textAlign: 'center', padding: '16px 0' }}>
          No trending polls yet
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {polls.map((poll, idx) => {
            const theme = TYPE_THEMES[poll.type] || { color: '#8899b8', bg: 'rgba(255,255,255,0.05)' };
            return (
              <div
                key={poll._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                {/* Rank badge */}
                <div
                  style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    background: idx === 0
                      ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                      : idx === 1
                      ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                      : idx === 2
                      ? 'linear-gradient(135deg, #b45309, #92400e)'
                      : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: idx < 3 ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '0.625rem', fontWeight: 800, color: idx < 3 ? '#fff' : '#4d607e' }}>
                    #{idx + 1}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8125rem', color: '#c4cfe4', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                    {poll.question}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span
                      style={{
                        fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                        color: theme.color, background: theme.bg,
                        padding: '1px 7px', borderRadius: '99px',
                      }}
                    >
                      {poll.type}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#4d607e', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <BarChart3 size={10} />
                      {poll.totalVotes}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
