import express from 'express';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import {
    createPoll,
    getAllPolls,
    getPollById,
    voteOnPoll,
    getVotedPolls,
    closePoll,
    openPoll,
    toggleBookmark,
    getBookmarkedPolls,
    deletePoll,
    getMyPolls,
    getTrendingPolls,
} from '../controllers/pollController.js';

const router = express.Router();

// ── Public routes (guests can browse) ──────────────────────────────────────
// NOTE: exact-path routes MUST come before /:id wildcard
router.get('/', optionalAuth, getAllPolls);
router.get('/trending', optionalAuth, getTrendingPolls);

// ── Protected routes — exact paths before /:id wildcard ─────────────────────
router.post('/create', protect, createPoll);
router.get('/voted', protect, getVotedPolls);
router.get('/bookmarked', protect, getBookmarkedPolls);
router.get('/my-polls', protect, getMyPolls);

// ── Wildcard :id routes ──────────────────────────────────────────────────────
router.get('/:id', optionalAuth, getPollById);
router.post('/:id/vote', protect, voteOnPoll);
router.patch('/:id/close', protect, closePoll);
router.patch('/:id/open', protect, openPoll);
router.patch('/:id/bookmark', protect, toggleBookmark);
router.delete('/:id', protect, deletePoll);

export default router;
