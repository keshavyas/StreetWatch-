const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    addScan,
    getUserScans,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Profile route
router.get('/user/profile', protect, getUserProfile);

// Scan routes
router.post('/scans', protect, addScan);
router.get('/scans/me', protect, getUserScans);

module.exports = router;