const express = require('express');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/quizzes/start
// POST /api/quizzes/start
router.post('/start', protect, async (req, res) => {
  try {
    let { topic, difficulty, count, quizMode } = req.body;

    // fallback defaults
    count = Number(count) || 5;

    // Build dynamic filter
    const query = {};
    if (topic && topic !== '') {
      // Use case-insensitive regex to match "dsa", "DSA", "Dsa", etc.
      query.topic = { $regex: new RegExp(`^${topic}$`, 'i') };
    }
    if (difficulty && difficulty !== '') {
      query.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
    }

    // quizMode filtering
    if (quizMode === 'mcq') {
      query.options = { $exists: true, $not: { $size: 0 } };
    } else if (quizMode === 'open') {
      query.$or = [
        { options: { $exists: false } },
        { options: { $size: 0 } }
      ];
    }

    // Fetch questions that match filters
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: count } } // randomize selection
    ]);

    res.json({ questions });
  } catch (err) {
    console.error('Quiz start error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/quizzes/submit
router.post('/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, userAnswer}]
    let score = 0;

    const detailedAnswers = [];
    const results = [];

    for (const a of answers) {
      const q = await Question.findById(a.questionId);
      if (!q) continue;

      const isCorrect = q.correctAnswer === a.userAnswer;
      if (isCorrect) score += 1;

      detailedAnswers.push({
        question: a.questionId,
        userAnswer: a.userAnswer,
        isCorrect,
      });

      // for frontend results list
      results.push({
        questionId: q._id,
        correct: isCorrect,
        correctAnswer: q.correctAnswer,
        userAnswer: a.userAnswer,
      });
    }

    const firstQ = await Question.findById(answers[0]?.questionId);
    const quizTopic = firstQ ? firstQ.topic : 'General';

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      questions: answers.map(a => a.questionId),
      answers: detailedAnswers,
      score,
      totalQuestions: answers.length,
      topic: quizTopic,
    });

    res.json({
      score,
      attemptId: attempt._id,
      results,
    });
  } catch (err) {
    console.error('Quiz submit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/quizzes/history  (current user's attempts)
router.get('/history', protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ attempts });
  } catch (err) {
    console.error('Quiz history error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/quizzes/history (reset stats)
router.delete('/history', protect, async (req, res) => {
  try {
    await QuizAttempt.deleteMany({ user: req.user._id });
    res.json({ message: 'Statistics reset successfully' });
  } catch (err) {
    console.error('Reset stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/userStats.js (example)



module.exports = router;
