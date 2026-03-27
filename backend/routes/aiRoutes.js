const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Gemini SDK [web:146]

const router = express.Router();

// Create Gemini client using env key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

// Debug once (safe)
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing');
} else {
  console.log('✅ GEMINI_API_KEY loaded');
}

/**
 * POST /api/ai/feedback
 * Existing route – keep as is
 */
router.post('/feedback', protect, async (req, res) => {
  try {
    const { questionText, userAnswer, questionType } = req.body;

    if (!questionText || !userAnswer) {
      return res.status(400).json({
        message: 'questionText and userAnswer are required',
      });
    }

    const prompt = `
You are a professional interview coach.

Question Type: ${questionType || 'DSA / Behavioral'}
Question: ${questionText}
Candidate Answer: ${userAnswer}

${req.body.options ? `This is a Multiple Choice Question. The available options were: ${req.body.options.join(', ')}.` : ''}

Return feedback in Markdown with **exactly** this structure:

**Overall**
- One short sentence (mention if the answer is correct or not if it's MCQ)

**Explanation**
- Provide a detailed explanation of the correct answer. ${req.body.options ? 'Explain why the chosen option is correct and why others are incorrect.' : ''}

**Strengths**
- 1–2 bullet points about the candidate's logic

**Improvements**
- 1–2 bullet points for future reference

Keep total under 150 words.
`;

    // Basic rate limit: 200ms delay
    await new Promise(r => setTimeout(r, 200));
    const result = await model.generateContent(prompt);
    const response = result.response;
    const feedback = response.text().trim();

    if (!feedback) {
      return res.status(500).json({
        message: 'Empty response from AI',
      });
    }

    res.status(200).json({ feedback });
  } catch (error) {
    console.error('❌ Gemini feedback error:', error);
    const isQuotaError = error.message?.includes('429') || error.status === 429;
    res.status(isQuotaError ? 429 : 500).json({
      message: isQuotaError ? 'AI Quota exceeded. Please try again in a few minutes or check your Gemini API plan.' : 'AI feedback failed',
      error: error.message || 'Unknown error',
    });
  }
});

/**
 * NEW: POST /api/ai/chat
 * For global chatbot widget
 */
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Build multi-turn chat contents
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text:
              'You are an AI interview coach for an AI Interview Prep web app. ' +
              'Help with DSA, web development, and interview preparation. ' +
              'Be concise, give hints first, and keep responses friendly.',
          },
        ],
      },
      ...history.map((m) => ({
        role: m.role || (m.from === 'user' ? 'user' : 'model'),
        parts: [{ text: m.content || m.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    // Basic rate limit: 200ms delay
    await new Promise(r => setTimeout(r, 200));
    const result = await model.generateContent({ contents });
    const reply = result.response.text().trim();

    if (!reply) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error('❌ Gemini chat error:', error);
    const isQuotaError = error.message?.includes('429') || error.status === 429;
    res.status(isQuotaError ? 429 : 500).json({
      error: isQuotaError ? 'AI Quota exceeded. Please try again later.' : 'AI chat failed',
      details: error.message || 'Unknown error',
    });
  }
});

module.exports = router;
