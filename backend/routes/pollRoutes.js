import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
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

// All routes are protected
router.use(protect);

router.post('/create', createPoll);
router.get('/', getAllPolls);
router.get('/trending', getTrendingPolls);
router.get('/voted', getVotedPolls);
router.get('/bookmarked', getBookmarkedPolls);
router.get('/my-polls', getMyPolls);
router.get('/:id', getPollById);
router.post('/:id/vote', voteOnPoll);
router.patch('/:id/close', closePoll);
router.patch('/:id/open', openPoll);
router.patch('/:id/bookmark', toggleBookmark);
router.delete('/:id', deletePoll);


export default router;
