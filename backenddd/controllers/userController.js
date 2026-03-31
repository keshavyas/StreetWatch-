const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Scan = require('../models/Scan');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name: name || email.split('@')[0], 
            email,
            password,
            scansLeft: 10,
            subscription: 'basic',
            currentPlan: 'basic'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                scansLeft: user.scansLeft,
                subscription: user.subscription,
                currentPlan: user.currentPlan
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                scansLeft: user.scansLeft,
                subscription: user.subscription,
                currentPlan: user.currentPlan
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                scansLeft: user.scansLeft,
                subscription: user.subscription,
                currentPlan: user.currentPlan
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Profile fetch failed' });
    }
};

// @desc    Add a scan
// @route   POST /api/scans
// @access  Private
const addScan = async (req, res) => {
    try {
        const { incidents, location, threatScore, type } = req.body;
        const user = await User.findById(req.user._id);

        if (user.scansLeft <= 0) {
            return res.status(400).json({ message: 'No scans left. Please upgrade your plan.' });
        }

        const scan = await Scan.create({
            userId: req.user._id,
            incidents: incidents || [
                { timestamp: '00:45-52s', description: 'Anomaly detected in zone B', severity: 'HIGH', confidence: 88 }
            ],
            location: location || 'Custom Feed',
            threatScore: threatScore || 88,
            type: type || 'FIRE / THEFT',
            dateTime: new Date(),
        });

        if (scan) {
            user.scansLeft -= 1;
            await user.save();

            res.status(201).json({
                scan,
                scansLeft: user.scansLeft
            });
        } else {
            res.status(400).json({ message: 'Invalid scan data' });
        }
    } catch (error) {
        console.error('Scan Error:', error);
        res.status(500).json({ message: 'Failed to record scan' });
    }
};

// @desc    Get user's scans
// @route   GET /api/scans/me
// @access  Private
const getUserScans = async (req, res) => {
    try {
        const scans = await Scan.find({ userId: req.user._id }).sort({ dateTime: -1 });
        res.json(scans);
    } catch (error) {
        console.error('Fetch Scans Error:', error);
        res.status(500).json({ message: 'Fetch scans failed' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    addScan,
    getUserScans
};