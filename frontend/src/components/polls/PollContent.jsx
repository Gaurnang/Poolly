import { useState } from 'react';
import { Star, Send } from 'lucide-react';

export default function PollContent({ poll, onVote, submitting }) {
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (poll.type === 'open-ended') {
      if (!text.trim()) return;
      onVote({ text: text.trim() });
    } else if (poll.type === 'rating') {
      if (!rating) return;
      onVote({ rating });
    } else {
      if (selected === null) return;
      onVote({ optionIndex: selected });
    }
  };

  // Single choice / Yes/No
  if (['single-choice', 'yes/no'].includes(poll.type)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          /* Single-choice / Yes-No: non-interactive radio display + clickable via wrapper */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {poll.options.map((opt, i) => (
              <div
                key={i}
                onClick={() => setSelected(i)}
                role="radio"
                aria-checked={selected === i}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${selected === i ? '#7c3aed' : 'rgba(255,255,255,0.07)'}`,
                  background: selected === i ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: selected === i ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
                  userSelect: 'none',
                }}
                onMouseEnter={e => {
                  if (selected !== i) {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
                    e.currentTarget.style.background = 'rgba(124,58,237,0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (selected !== i) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
              >
                {/* Custom radio dot (purely visual, no pointer-events) */}
                <div
                  style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: `2px solid ${selected === i ? '#7c3aed' : '#4d607e'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'border-color 0.2s',
                    pointerEvents: 'none',
                  }}
                >
                  {selected === i && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }} />}
                </div>
                <span style={{ fontSize: '0.875rem', color: selected === i ? '#e8edf8' : '#c4cfe4', fontWeight: selected === i ? 600 : 400, pointerEvents: 'none' }}>
                  {opt.optionText}
                </span>
              </div>
            ))}
          </div>

        <button
          onClick={handleSubmit}
          disabled={selected === null || submitting}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '4px', padding: '10px', borderRadius: '10px', fontSize: '0.875rem' }}
        >
          {submitting ? (
            <div className="spinner" style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
          ) : (
            <>
              <Send size={14} />
              Submit Vote
            </>
          )}
        </button>
      </div>
    );
  }

  // Rating
  if (poll.type === 'rating') {
    const displayRating = hoverRating || rating;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '0.8125rem', color: '#8899b8' }}>Tap a star to rate</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                fontSize: '1.75rem', lineHeight: 1,
                color: displayRating >= star ? '#f59e0b' : '#1e2d4a',
                background: 'none', border: 'none', cursor: 'pointer',
                transition: 'all 0.15s ease',
                transform: displayRating >= star ? 'scale(1.2)' : 'scale(1)',
                padding: '2px',
              }}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <span style={{ fontSize: '0.875rem', color: '#f59e0b', marginLeft: '6px', fontWeight: 600 }}>{rating}/5</span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!rating || submitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.875rem' }}
        >
          {submitting ? (
            <div className="spinner" style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
          ) : 'Submit Rating'}
        </button>
      </div>
    );
  }

  // Open-ended
  if (poll.type === 'open-ended') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="input-field"
          style={{ width: '100%', borderRadius: '10px', padding: '11px 14px', resize: 'none', fontSize: '0.875rem' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.875rem' }}
        >
          {submitting ? (
            <div className="spinner" style={{ width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
          ) : (
            <>
              <Send size={14} />
              Submit Response
            </>
          )}
        </button>
      </div>
    );
  }

  return null;
}
