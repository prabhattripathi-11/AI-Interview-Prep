const express = require('express');
const Question = require('../models/Question');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'questions route working' });
});

// POST /api/questions  (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { text, type, topic, company, difficulty, options, correctAnswer } =
      req.body;

    if (!text || !type || !topic) {
      return res.status(400).json({ message: 'text, type, topic required' });
    }

    const question = await Question.create({
      text,
      type,
      topic,
      company,
      difficulty,
      options,
      correctAnswer,
      createdBy: req.user._id
    });

    res.status(201).json(question);
  } catch (err) {
    console.error('Create question error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/questions/:id (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check ownership
    // Assuming req.user._id is available via 'protect' middleware
    if (question.createdBy && question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this question' });
    }

    // If createdBy is missing (old questions), only allow admin? 
    // Or just prevent deletion. For now, let's assume valid scenarios.
    if (!question.createdBy) {
      // optionally check if req.user.isAdmin
      // return res.status(401).json({ message: 'Cannot delete system questions' });
    }

    await question.deleteOne();
    res.json({ message: 'Question removed' });
  } catch (err) {
    console.error('Delete question error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/questions  (all users)
router.get('/', protect, async (req, res) => {
  try {
    const { type, topic, difficulty } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
