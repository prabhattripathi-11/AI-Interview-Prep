const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newSubscriber = await Newsletter.create({
            email
        });

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to the newsletter!',
            data: newSubscriber
        });

    } catch (error) {
        console.error('Newsletter Error:', error);

        // Handle duplicate key error specifically if it slips through
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        res.status(500).json({
            message: 'Server error while subscribing',
            error: error.message
        });
    }
});

module.exports = router;
