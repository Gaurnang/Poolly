import { BarChart3, MessageSquare } from 'lucide-react';

export default function PollResultContent({ poll }) {
  const total = poll.totalVotes || 0;

  // Open-ended
  if (poll.type === 'open-ended') {
    const responses = poll.responses?.filter(r => r.text) || [];
    return (
      <div>
        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#8899b8', marginBottom: '10px' }}>
          <MessageSquare size={13} />
          {responses.length} response{responses.length !== 1 ? 's' : ''}
        </p>
        {responses.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#4d607e', fontStyle: 'italic' }}>No responses yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
            {responses.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.8125rem',
                  color: '#c4cfe4',
                  lineHeight: 1.5,
                }}
              >
                {r.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Rating
  if (poll.type === 'rating') {
    const ratings = poll.responses?.filter(r => r.rating).map(r => r.rating) || [];
    const avg = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : 0;
    const distribution = [5, 4, 3, 2, 1].map(star => {
      const count = ratings.filter(r => r === star).length;
      const pct = ratings.length > 0 ? Math.round((count / ratings.length) * 100) : 0;
      return { star, count, pct };
    });

    return (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Average */}
        <div style={{ textAlign: 'center', minWidth: '56px' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{avg}</p>
          <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
            {[1,2,3,4,5].map(s => (
              <span
                key={s}
                style={{ fontSize: '0.875rem', color: s <= Math.round(avg) ? '#f59e0b' : '#1e2d4a' }}
              >★</span>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: '#4d607e', marginTop: '4px' }}>{ratings.length} votes</p>
        </div>

        {/* Distribution */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {distribution.map(({ star, count, pct }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
              <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>★</span>
              <span style={{ color: '#8899b8', width: '10px' }}>{star}</span>
              <div style={{ flex: 1, height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
              <span style={{ color: '#4d607e', width: '28px', textAlign: 'right' }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single-choice / Yes-No
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#8899b8' }}>
        <BarChart3 size={13} />
        {total} vote{total !== 1 ? 's' : ''} total
      </p>

      {poll.options.map((opt, i) => {
          const votes = opt.votes?.length || 0;
          const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
          const isLeading = votes === Math.max(...poll.options.map(o => o.votes?.length || 0)) && votes > 0;
          return (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.8125rem', color: isLeading ? '#e8edf8' : '#c4cfe4', fontWeight: isLeading ? 600 : 400 }}>
                  {opt.optionText}
                  {isLeading && <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#a78bfa' }}>Leading</span>}
                </span>
                <span style={{ fontSize: '0.8125rem', color: isLeading ? '#a78bfa' : '#8899b8', fontWeight: 700 }}>{pct}%</span>
              </div>
              <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '99px',
                    width: `${pct}%`,
                    background: isLeading
                      ? 'linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)'
                      : 'linear-gradient(90deg, #1e2d4a, #243558)',
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                    position: 'relative',
                  }}
                >
                  {isLeading && pct > 15 && (
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '20px', background: 'rgba(255,255,255,0.2)', filter: 'blur(3px)' }} />
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#4d607e', marginTop: '3px' }}>{votes} vote{votes !== 1 ? 's' : ''}</p>
            </div>
          );
      })}
    </div>
  );
}
