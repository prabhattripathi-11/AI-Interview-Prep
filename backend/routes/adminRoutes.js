const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.body;

        // Validate role
        if (!['user', 'admin', 'mentor'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optional: Prevent Admin from removing their own admin status if they are the only one, 
        // but for now, let's just allow it.

        user.role = role;
        await user.save();

        res.json({ message: `User updated to ${role}`, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @desc    Get admin stats
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalQuestions = await Question.countDocuments();
        const totalFeedback = await Feedback.countDocuments();
        const pendingFeedback = await Feedback.countDocuments({ adminReply: { $exists: false } });

        res.json({
            totalUsers,
            totalQuestions,
            totalFeedback,
            pendingFeedback
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
