const POLL_TYPES = [
  { value: 'all', label: 'All', emoji: '✦' },
  { value: 'single-choice', label: 'Choice', emoji: '◉' },
  { value: 'yes/no', label: 'Yes/No', emoji: '⊕' },
  { value: 'rating', label: 'Rating', emoji: '★' },
  { value: 'open-ended', label: 'Open', emoji: '✎' },
];

const ACTIVE_COLORS = {
  all: { bg: 'rgba(124,58,237,0.2)', border: 'rgba(124,58,237,0.5)', color: '#c4b5fd' },
  'single-choice': { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.4)', color: '#c4b5fd' },
  'yes/no': { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', color: '#6ee7b7' },
  rating: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', color: '#fcd34d' },
  'open-ended': { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.4)', color: '#f9a8d4' },
};

export default function FilterByPollType({ activeType, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {POLL_TYPES.map(({ value, label, emoji }) => {
        const isActive = activeType === value;
        const theme = ACTIVE_COLORS[value];
        return (
          <button
            key={value}
            id={`filter-${value}`}
            onClick={() => onChange(value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '99px',
              fontSize: '0.8125rem',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              border: `1px solid ${isActive ? theme.border : 'rgba(255,255,255,0.08)'}`,
              background: isActive ? theme.bg : 'rgba(255,255,255,0.03)',
              color: isActive ? theme.color : '#8899b8',
              transition: 'all 0.2s ease',
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.color = '#e8edf8';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.color = '#8899b8';
              }
            }}
          >
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{emoji}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
