const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        jobRole: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active',
        },
        conversation: [
            {
                role: { type: String, enum: ['ai', 'user', 'system'], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                // Only for user answers
                feedback: {
                    confidenceScore: Number,
                    communicationScore: Number,
                    accuracyScore: Number,
                    tips: [String],
                },
            },
        ],
        summary: {
            overallScore: Number,
            feedback: String,
            strengths: [String],
            weaknesses: [String],
            actionPlan: [String],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
