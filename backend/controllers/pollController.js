import Poll from '../models/Poll.js';
import User from '../models/User.js';

export const createPoll = async (req, res) => {
    const { question, type, options } = req.body;

    if (!question || !type) {
        return res.status(400).json({ message: 'Question and type are required' });
    }

    // Validate options based on type
    if (type !== 'open-ended' && type !== 'rating') {
        if (!options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: 'At least 2 options are required' });
        }
    }

    try {
        const poll = await Poll.create({
            question,
            type,
            options: options || [],
            createdBy: req.user._id,
        });

        const populatedPoll = await Poll.findById(poll._id).populate(
            'createdBy',
            'username fullName'
        );

        res.status(201).json(populatedPoll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all polls with pagination & type filter
// @route   GET /api/polls
// @access  Private
export const getAllPolls = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || '';
    const skip = (page - 1) * limit;

    try {
        const filter = {};
        if (type && type !== 'all') {
            filter.type = type;
        }

        const total = await Poll.countDocuments(filter);
        const polls = await Poll.find(filter)
            .populate('createdBy', 'username fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            polls,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalPolls: total,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single poll by ID
// @route   GET /api/polls/:id
// @access  Private
export const getPollById = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).populate(
            'createdBy',
            'username fullName'
        );

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        res.status(200).json(poll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Vote on a poll
// @route   POST /api/polls/:id/vote
// @access  Private
export const voteOnPoll = async (req, res) => {
    const { optionIndex, rating, text } = req.body;

    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (poll.isClosed) {
            return res.status(400).json({ message: 'Poll is closed' });
        }

        // Check if user already voted
        const alreadyVoted = poll.voters.includes(req.user._id);
        if (alreadyVoted) {
            return res.status(400).json({ message: 'You have already voted on this poll' });
        }

        // Record the vote based on poll type
        if (poll.type === 'open-ended') {
            if (!text) {
                return res.status(400).json({ message: 'Text response is required' });
            }
            poll.responses.push({ user: req.user._id, text });
        } else if (poll.type === 'rating') {
            if (rating === undefined || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating between 1 and 5 is required' });
            }
            poll.responses.push({ user: req.user._id, rating });
        } else {
            if (optionIndex === undefined) {
                return res.status(400).json({ message: 'Option selection is required' });
            }
            if (optionIndex < 0 || optionIndex >= poll.options.length) {
                return res.status(400).json({ message: 'Invalid option index' });
            }
            poll.options[optionIndex].votes.push(req.user._id);
            poll.responses.push({ user: req.user._id, optionIndex });
        }

        poll.voters.push(req.user._id);
        poll.totalVotes += 1;
        await poll.save();

        const updatedPoll = await Poll.findById(req.params.id).populate(
            'createdBy',
            'username fullName'
        );
        res.status(200).json(updatedPoll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get polls voted by the current user
// @route   GET /api/polls/voted
// @access  Private
export const getVotedPolls = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const total = await Poll.countDocuments({ voters: req.user._id });
        const polls = await Poll.find({ voters: req.user._id })
            .populate('createdBy', 'username fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            polls,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Close a poll (admin / creator only)
// @route   PATCH /api/polls/:id/close
// @access  Private
export const closePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (poll.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to close this poll' });
        }

        poll.isClosed = true;
        poll.closedAt = new Date();
        await poll.save();

        res.status(200).json({ message: 'Poll closed successfully', poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Open a closed poll (admin / creator only)
// @route   PATCH /api/polls/:id/open
// @access  Private
export const openPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (poll.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to open this poll' });
        }

        poll.isClosed = false;
        poll.closedAt = null;
        await poll.save();

        res.status(200).json({ message: 'Poll reopened successfully', poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Bookmark / Unbookmark a poll
// @route   PATCH /api/polls/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const user = await User.findById(req.user._id);
        const bookmarked = user.booksmarkedpolls.some(id => id.toString() === req.params.id);

        if (bookmarked) {
            user.booksmarkedpolls = user.booksmarkedpolls.filter(
                (id) => id.toString() !== req.params.id
            );
            await user.save();
            return res.status(200).json({ message: 'Poll unbookmarked', bookmarked: false });
        } else {
            user.booksmarkedpolls.push(req.params.id);
            await user.save();
            return res.status(200).json({ message: 'Poll bookmarked', bookmarked: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get bookmarked polls
// @route   GET /api/polls/bookmarked
// @access  Private
export const getBookmarkedPolls = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const user = await User.findById(req.user._id);
        const bookmarkedIds = user.booksmarkedpolls;

        const total = bookmarkedIds.length;
        const polls = await Poll.find({ _id: { $in: bookmarkedIds } })
            .populate('createdBy', 'username fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            polls,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a poll (creator only)
// @route   DELETE /api/polls/:id
// @access  Private
export const deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (poll.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this poll' });
        }

        await Poll.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get polls created by the current user
// @route   GET /api/polls/my-polls
// @access  Private
export const getMyPolls = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const total = await Poll.countDocuments({ createdBy: req.user._id });
        const polls = await Poll.find({ createdBy: req.user._id })
            .populate('createdBy', 'username fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            polls,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get trending polls (most votes)
// @route   GET /api/polls/trending
// @access  Private
export const getTrendingPolls = async (req, res) => {
    try {
        const polls = await Poll.find({ isClosed: false })
            .populate('createdBy', 'username fullName')
            .sort({ totalVotes: -1 })
            .limit(5);

        res.status(200).json(polls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
