import { BarChart3 } from 'lucide-react';

const LoadingSpinner = ({ fullscreen = false, size = 'md' }) => {
  const sizeMap = {
    sm: { ring: '16px', border: '2px', text: '0.75rem' },
    md: { ring: '32px', border: '3px', text: '0.875rem' },
    lg: { ring: '48px', border: '3px', text: '0.9375rem' },
  };
  const s = sizeMap[size];

  const ring = (
    <div
      className="spinner"
      style={{
        width: s.ring,
        height: s.ring,
        border: `${s.border} solid rgba(124,58,237,0.15)`,
        borderTopColor: '#7c3aed',
        borderRadius: '50%',
      }}
    />
  );

  if (fullscreen) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#080b14', zIndex: 100, gap: '20px',
        }}
      >
        {/* Animated logo */}
        <div
          style={{
            width: '56px', height: '56px', borderRadius: '15px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 0 rgba(124,58,237,0.4)',
            animation: 'glow-pulse 2s ease-in-out infinite, float 3s ease-in-out infinite',
          }}
        >
          <BarChart3 size={28} color="white" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid rgba(124,58,237,0.15)', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
          <p style={{ fontSize: '0.875rem', color: '#8899b8', fontWeight: 500, letterSpacing: '0.02em' }}>Loading Poolly...</p>
        </div>
      </div>
    );
  }

  return ring;
};

export default LoadingSpinner;
