const express = require('express');
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public (or Private if you want only registered users)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, category, message, userId } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const feedback = await Feedback.create({
            name,
            email,
            subject,
            category,
            message,
            user: userId || null,
        });

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: feedback,
        });
    } catch (err) {
        console.error('Feedback submission error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
// @access  Private/Admin
router.get('/', protect, authorize('admin', 'mentor'), async (req, res) => {
    try {
        const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error('Get feedback error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Reply to feedback (Admin only)
// @route   PUT /api/feedback/:id/reply
// @access  Private/Admin
router.put('/:id/reply', protect, authorize('admin', 'mentor'), async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Reply message is required' });
        }

        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        feedback.adminReply = message;
        feedback.repliedAt = Date.now();
        await feedback.save();

        res.json({
            success: true,
            message: 'Reply added successfully',
            data: feedback
        });
    } catch (err) {
        console.error('Reply feedback error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
