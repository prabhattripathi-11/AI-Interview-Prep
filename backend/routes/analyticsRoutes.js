const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const QuizAttempt = require('../models/QuizAttempt');
const Interview = require('../models/Interview');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

/**
 * @desc    Get aggregated analytics data
 * @route   GET /api/analytics
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch all History
        const quizAttempts = await QuizAttempt.find({ user: userId }).sort({ createdAt: 1 });
        const interviews = await Interview.find({ user: userId, status: 'completed' }).sort({ createdAt: 1 });

        // 2. Process Timeline Data (Accuracy vs Time)
        // Combine both sources, normalize to 0-100 scale
        const timeline = [];

        quizAttempts.forEach(q => {
            const count = q.totalQuestions || q.answers?.length || 5;
            const percentage = (q.score / count) * 100;
            timeline.push({
                date: q.createdAt,
                score: Math.round(percentage),
                type: 'Quiz',
                topic: q.topic || 'General'
            });
        });

        interviews.forEach(i => {
            if (i.summary && i.summary.overallScore) {
                timeline.push({
                    date: i.createdAt,
                    score: i.summary.overallScore,
                    type: 'Interview',
                    topic: i.topic || 'General'
                });
            }
        });

        // Sort combined timeline
        timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 3. Process Topic Mastery
        const topicStats = {}; // { 'DSA': { sum: 200, count: 2 }, ... }

        const addToStats = (topic, score) => {
            if (!topicStats[topic]) topicStats[topic] = { sum: 0, count: 0 };
            topicStats[topic].sum += score;
            topicStats[topic].count += 1;
        };

        timeline.forEach(item => addToStats(item.topic, item.score));

        const mastery = Object.keys(topicStats).map(topic => ({
            topic,
            score: Math.round(topicStats[topic].sum / topicStats[topic].count),
            attempts: topicStats[topic].count,
            fullMark: 100
        }));

        // 4. Generate AI Insights
        // Only generate if we have data to avoid wasting tokens
        let insights = "Complete more quizzes and interviews to unlock AI insights about your progress.";

        if (timeline.length > 2) {
            try {
                const prompt = `
          Analyze this user's study performance data:
          
          Topic Mastery: ${JSON.stringify(mastery)}
          Recent History (Last 5 scores): ${JSON.stringify(timeline.slice(-5))}
          
          Generate a short, motivational, 2-sentence insight about their progress. 
          Highlight improvement or a specific weak area to focus on.
          Address the user directly as "You".
        `;

                // Basic rate limit: 200ms delay
                await new Promise(r => setTimeout(r, 200));
                const result = await model.generateContent(prompt);
                insights = result.response.text();
            } catch (aiError) {
                console.error("AI Insight generation failed:", aiError);
            }
        }

        res.json({
            timeline,
            mastery,
            insights,
            stats: {
                totalQuizzes: quizAttempts.length,
                totalInterviews: interviews.length,
                avgScore: timeline.length > 0
                    ? Math.round(timeline.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / timeline.length)
                    : 0
            }
        });

    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
});

module.exports = router;
