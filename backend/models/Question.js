const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['dsa', 'behavioral', 'oops', 'dbms', 'web development'],
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    company: {
      type: String
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    // for MCQ later; for now you can ignore
    options: [String],
    correctAnswer: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
