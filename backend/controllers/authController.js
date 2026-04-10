import User from "../models/User.js";
import Poll from "../models/Poll.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
    const { username, fullName, email, password } = req.body;
    const displayName = fullName || username;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers and underscores' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.create({
            username,
            fullName: displayName,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const totalPollsCreated = await Poll.countDocuments({ createdBy: user._id });
        const totalPollsVotes = await Poll.countDocuments({ voters: user._id });
        const totalPollsBooked = user.booksmarkedpolls?.length || 0;

        res.status(200).json({
            token: generateToken(user._id),
            user: {
                ...user.toObject(),
                password: undefined,
                totalPollsCreated,
                totalPollsVotes,
                totalPollsBooked,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const totalPollsCreated = await Poll.countDocuments({ createdBy: user._id });
        const totalPollsVotes = await Poll.countDocuments({ voters: user._id });
        const totalPollsBooked = user.booksmarkedpolls?.length || 0;

        const userInfo = {
            ...user.toObject(),
            totalPollsCreated,
            totalPollsVotes,
            totalPollsBooked,
        };
        res.status(200).json({ user: userInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUsername = async (req, res) => {
    const { username } = req.body;
    if (!username || !username.trim()) {
        return res.status(400).json({ message: 'Username is required' });
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers and underscores' });
    }
    if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }
    try {
        const existing = await User.findOne({ username });
        if (existing && existing._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username, fullName: username },
            { new: true }
        ).select('-password');
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};