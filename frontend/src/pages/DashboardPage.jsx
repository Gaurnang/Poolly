import { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart3, PlusCircle, TrendingUp, CheckSquare, Bookmark, Zap } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getAllPolls } from '../utils/api';
import FilterByPollType from '../components/polls/FilterByPollType';
import PollCard from '../components/polls/PollCard';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STAT_THEMES = [
  {
    key: 'totalPollsCreated',
    label: 'Polls Created',
    icon: BarChart3,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
    glow: 'rgba(124,58,237,0.3)',
    text: '#a78bfa',
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.2)',
  },
  {
    key: 'totalPollsVotes',
    label: 'Votes Cast',
    icon: CheckSquare,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    glow: 'rgba(6,182,212,0.3)',
    text: '#67e8f9',
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.2)',
  },
  {
    key: 'totalPollsBooked',
    label: 'Bookmarked',
    icon: Bookmark,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    glow: 'rgba(16,185,129,0.3)',
    text: '#6ee7b7',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
  },
];

const SKELETON_CARD = (
  <div style={{ background: 'rgba(15,22,45,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', height: '260px' }}>
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '99px' }} />
      <div className="skeleton" style={{ height: '16px', width: '100%' }} />
      <div className="skeleton" style={{ height: '16px', width: '70%' }} />
      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="skeleton" style={{ height: '40px', borderRadius: '10px' }} />
        <div className="skeleton" style={{ height: '40px', borderRadius: '10px' }} />
        <div className="skeleton" style={{ height: '40px', borderRadius: '10px' }} />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useUser();
  const [polls, setPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  const fetchPolls = useCallback(async (pageNum, type, reset = false) => {
    setLoading(true);
    try {
      const res = await getAllPolls(pageNum, 8, type === 'all' ? '' : type);
      const newPolls = res.data.polls;
      setPolls(prev => reset ? newPolls : [...prev, ...newPolls]);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setPolls([]);
    setInitialLoading(true);
    fetchPolls(1, activeType, true);
  }, [activeType, fetchPolls]);

  useEffect(() => {
    if (!loaderRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => {
            const next = prev + 1;
            fetchPolls(next, activeType);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, activeType, fetchPolls]);

  const firstName = user?.username ?? 'there';

  return (
    <div className="fade-up">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div
            className="flex items-center gap-2 mb-2"
            style={{
              display: 'inline-flex',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '99px',
              padding: '4px 12px',
              gap: '6px',
              marginBottom: '10px',
            }}
          >
            <Zap size={12} color="#a78bfa" />
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>Community Feed</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e8edf8', letterSpacing: '-0.02em' }}>
            Hey, {firstName} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#8899b8', marginTop: '4px' }}>
            Discover and participate in trending polls
          </p>
        </div>
        <Link
          to="/create-poll"
          id="dashboard-create-poll"
          className="btn btn-primary"
          style={{ padding: '11px 20px', borderRadius: '10px', fontSize: '0.875rem' }}
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Create Poll</span>
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {STAT_THEMES.map(({ key, label, icon: Icon, gradient, glow, text, bg, border }) => (
          <div
            key={key}
            style={{
              background: 'rgba(15,22,45,0.7)',
              border: `1px solid ${border}`,
              borderRadius: '14px',
              padding: '20px',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${glow}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 12px ${glow}`,
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: text, lineHeight: 1 }}>
                  {user?.[key] ?? 0}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#8899b8', marginTop: '3px' }}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div style={{ display: 'block' }}>
        {/* Poll feed column */}
        <div>
          {/* Filter bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#4d607e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Browse Polls
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#4d607e' }}>
                {!initialLoading && `${polls.length} poll${polls.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <FilterByPollType activeType={activeType} onChange={setActiveType} />
          </div>

          {/* Grid */}
          {initialLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i}>{SKELETON_CARD}</div>
              ))}
            </div>
          ) : polls.length === 0 ? (
            <div
              style={{
                textAlign: 'center', padding: '60px 20px',
                background: 'rgba(15,22,45,0.5)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <BarChart3 size={24} color="#7c3aed" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e8edf8', marginBottom: '8px' }}>No polls found</h3>
              <p style={{ fontSize: '0.875rem', color: '#8899b8', marginBottom: '20px' }}>Be the first to create one!</p>
              <Link
                to="/create-poll"
                className="btn btn-primary"
                style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.875rem' }}
              >
                <PlusCircle size={15} />
                Create Poll
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {polls.map(poll => (
                <PollCard key={poll._id} poll={poll} />
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={loaderRef} style={{ display: 'flex', justifyContent: 'center', paddingTop: '24px', paddingBottom: '8px' }}>
            {loading && !initialLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8899b8', fontSize: '0.8125rem' }}>
                <LoadingSpinner size="sm" />
                Loading more polls...
              </div>
            )}
            {!hasMore && polls.length > 0 && (
              <p style={{ fontSize: '0.8125rem', color: '#4d607e' }}>— All polls loaded —</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
