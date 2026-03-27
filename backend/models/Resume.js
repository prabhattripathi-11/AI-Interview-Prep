const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetRole: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        matchScore: {
            type: Number,
            default: 0,
        },
        skills: {
            strong: [String],
            moderate: [String],
            missing: [String],
        },
        projects: [
            {
                name: String,
                description: String,
                techStack: [String],
            },
        ],
        generatedQuestions: [
            {
                question: String,
                type: {
                    type: String,
                    enum: ['Technical', 'Behavioral', 'Project-based'],
                },
                context: String, // e.g., "Based on your MERN project"
            },
        ],
        rawText: {
            type: String, // Store extracted text if needed for re-analysis, but could be large
            select: false, // Don't fetch by default
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
