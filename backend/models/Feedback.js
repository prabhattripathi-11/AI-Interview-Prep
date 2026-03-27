const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
        },
        subject: {
            type: String,
            required: [true, 'Please add a subject'],
        },
        category: {
            type: String,
            enum: ['feedback', 'problem', 'other'],
            default: 'feedback',
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Allow anonymous feedback if needed, but usually we have a logged in user
        },
        adminReply: {
            type: String,
            default: '',
        },
        repliedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
