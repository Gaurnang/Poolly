import { useState, useEffect, useCallback } from 'react';
import { Bookmark, BarChart3 } from 'lucide-react';
import { getBookmarkedPolls } from '../utils/api';
import PollCard from '../components/polls/PollCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BookmarkedPollsPage() {
  const [polls, setPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchPolls = useCallback(async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const res = await getBookmarkedPolls(pageNum);
      setPolls(prev => reset ? res.data.polls : [...prev, ...res.data.polls]);
      setHasMore(res.data.hasMore);
    } catch {
      toast.error('Failed to fetch bookmarks');
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
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
            }}
          >
            <Bookmark size={18} color="white" style={{ fill: 'white' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e8edf8', letterSpacing: '-0.02em' }}>
            Bookmarked
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#8899b8', marginLeft: '48px' }}>
          Your saved polls for quick access
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
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Bookmark size={28} color="#7c3aed" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#e8edf8', marginBottom: '8px' }}>No bookmarks yet</h3>
          <p style={{ fontSize: '0.875rem', color: '#8899b8', marginBottom: '24px' }}>
            Bookmark polls by clicking the bookmark icon on any poll card
          </p>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '10px' }}>
            <BarChart3 size={16} />
            Browse Polls
          </Link>
        </div>
      ) : (
        <div>
          {/* Count label */}
          <p style={{ fontSize: '0.8125rem', color: '#4d607e', marginBottom: '16px' }}>
            {polls.length} bookmarked poll{polls.length !== 1 ? 's' : ''}
          </p>

          {/* Poll grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {polls.map(poll => (
              <PollCard key={poll._id} poll={poll} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => { const next = page + 1; setPage(next); fetchPolls(next); }}
              disabled={loading}
              style={{
                width: '100%', marginTop: '20px', padding: '13px',
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
