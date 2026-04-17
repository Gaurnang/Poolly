import { useState, useEffect } from 'react';
import { Bookmark, Share2, Lock, CheckCircle, BarChart3, Star, MessageSquare, Users, BarChart2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { toggleBookmark, voteOnPoll, getUser } from '../../utils/api';
import toast from 'react-hot-toast';
import PollContent from './PollContent';
import PollResultContent from './PollResultContent';

const TYPE_THEMES = {
  'single-choice': { icon: CheckCircle, label: 'Choice',    color: '#a78bfa', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)' },
  'yes/no':        { icon: CheckCircle, label: 'Yes / No',  color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  'rating':        { icon: Star,        label: 'Rating',    color: '#fcd34d', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  'open-ended':    { icon: MessageSquare, label: 'Open Ended', color: '#f9a8d4', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)' },
};

export default function PollCard({ poll: initialPoll, onUpdate }) {
  const { user, updateUser } = useUser();
  const [poll, setPoll] = useState(initialPoll);
  const [bookmarked, setBookmarked] = useState(user?.booksmarkedpolls?.includes(poll._id));
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    setBookmarked(user?.booksmarkedpolls?.includes(poll._id));
  }, [user?.booksmarkedpolls, poll._id]);

  const hasVoted = poll.voters?.includes(user?._id);
  const theme = TYPE_THEMES[poll.type] || TYPE_THEMES['single-choice'];
  const TypeIcon = theme.icon;

  const createdAt = new Date(poll.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleBookmark = async () => {
    setBookmarking(true);
    try {
      const res = await toggleBookmark(poll._id);
      setBookmarked(res.data.bookmarked);
      if (user) {
        const updatedBookmarks = res.data.bookmarked
          ? [...(user.booksmarkedpolls || []), poll._id]
          : (user.booksmarkedpolls || []).filter(id => id !== poll._id);
        updateUser({ ...user, booksmarkedpolls: updatedBookmarks });
      }
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  const handleVote = async (voteData) => {
    setSubmitting(true);
    try {
      const res = await voteOnPoll(poll._id, voteData);
      setPoll(res.data);
      setShowResults(true);
      toast.success('Vote submitted! 🗳️');
      const userRes = await getUser();
      updateUser(userRes.data.user);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to vote');
    } finally {
      setSubmitting(false);
    }
  };

  // Decide what body to show
  // - voted OR showResults → results
  // - closed + not voted → show "View Results" prompt (no voting allowed)
  // - open + not voted → show voting form
  const showVoting = !hasVoted && !showResults && !poll.isClosed;
  const showResultsView = hasVoted || showResults;
  const showClosedPrompt = poll.isClosed && !hasVoted && !showResults;

  return (
    <div
      style={{
        background: 'rgba(15, 22, 45, 0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '18px',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,58,237,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header: badge + actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Type badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', borderRadius: '99px',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
            background: theme.bg, border: `1px solid ${theme.border}`, color: theme.color,
          }}>
            <TypeIcon size={10} />
            {theme.label}
          </span>
          {poll.isClosed && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', borderRadius: '99px',
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171',
            }}>
              <Lock size={9} />
              Closed
            </span>
          )}
        </div>
        {/* Bookmark + share */}
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            id={`bookmark-${poll._id}`}
            onClick={handleBookmark}
            disabled={bookmarking}
            style={{
              padding: '6px', borderRadius: '8px',
              background: bookmarked ? 'rgba(124,58,237,0.15)' : 'transparent',
              border: bookmarked ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
              color: bookmarked ? '#a78bfa' : '#4d607e',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!bookmarked) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#8899b8'; }}}
            onMouseLeave={e => { if (!bookmarked) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4d607e'; }}}
          >
            <Bookmark size={14} style={{ fill: bookmarked ? 'currentColor' : 'none' }} />
          </button>
          <button
            style={{ padding: '6px', borderRadius: '8px', background: 'transparent', border: '1px solid transparent', color: '#4d607e', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#8899b8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4d607e'; }}
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Question */}
      <div>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#e8edf8', lineHeight: 1.4, marginBottom: '8px' }}>
          {poll.question}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#4d607e', flexWrap: 'wrap' }}>
          <span>by <span style={{ color: '#7c3aed', fontWeight: 600 }}>@{poll.createdBy?.username}</span></span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>{createdAt}</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Users size={11} />
            {poll.totalVotes} votes
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

      {/* Body */}
      <div>
        {showResultsView && <PollResultContent poll={poll} />}

        {showVoting && <PollContent poll={poll} onVote={handleVote} submitting={submitting} />}

        {showClosedPrompt && (
          /* Poll closed, user hasn't voted — show view-results prompt */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}
            >
              <Lock size={14} color="#f87171" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.8125rem', color: '#8899b8' }}>
                This poll is closed. Voting is no longer available.
              </p>
            </div>
            <button
              onClick={() => setShowResults(true)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.875rem' }}
            >
              <BarChart2 size={15} />
              View Results
            </button>
          </div>
        )}
      </div>

      {/* Toggle results link (when showing results) */}
      {showResultsView && (
        <button
          onClick={() => setShowResults(!showResults)}
          style={{
            alignSelf: 'flex-start', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '0.75rem', color: '#7c3aed',
            fontWeight: 600, padding: 0, transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
          onMouseLeave={e => e.currentTarget.style.color = '#7c3aed'}
        >
          {showResults && hasVoted ? '↑ Viewing results' : showResults ? '↑ Hide results' : '↓ View results'}
        </button>
      )}
    </div>
  );
}
