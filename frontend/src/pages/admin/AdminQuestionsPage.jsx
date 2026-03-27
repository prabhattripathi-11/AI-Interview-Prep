import React, { useState } from 'react';
import { createQuestion } from '../../utils/api';

const AdminQuestionsPage = () => {
  const [text, setText] = useState('');
  const [type, setType] = useState('dsa');
  const [difficulty, setDifficulty] = useState('easy');
  const [tags, setTags] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isMCQ, setIsMCQ] = useState(false);
  const [options, setOptions] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (isMCQ && (options.some(opt => !opt.trim()) || !correctAnswer)) {
      setMessage('Please provide all options and select a correct answer');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      const payload = {
        text,
        type,
        difficulty,
        topic: type, // Link topic to type for easier filtering
        tags: tagArray,
        correctAnswer: isMCQ ? options[parseInt(correctAnswer)] : correctAnswer,
        options: isMCQ ? options : [],
      };

      await createQuestion(token, payload);

      setMessage('Question created successfully! 🚀');
      setText('');
      setTags('');
      setCorrectAnswer('');
      setOptions(['', '', '', '']);
      setIsMCQ(false);
    } catch (err) {
      setMessage(err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel" style={{ margin: 0 }}>
      <p style={{ marginBottom: '24px' }}>
        Add new DSA, OOPS, DBMS, or Web Development questions.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label>Question Text</label>
          <textarea
            rows="4"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter the question here..."
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="auth-input-group" style={{ marginBottom: 0 }}>
            <label>Topic / Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="dsa">DSA</option>
              <option value="oops">OOPS</option>
              <option value="dbms">DBMS</option>
              <option value="web development">Web Development</option>
              <option value="behavioral">Behavioral</option>
            </select>
          </div>

          <div className="auth-input-group" style={{ marginBottom: 0 }}>
            <label>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="auth-input-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            placeholder="e.g. arrays, recursion, react"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="isMCQ"
            checked={isMCQ}
            onChange={(e) => setIsMCQ(e.target.checked)}
            style={{ width: 'auto' }}
          />
          <label htmlFor="isMCQ" style={{ marginBottom: 0, cursor: 'pointer' }}>Multiple Choice Question (MCQ)</label>
        </div>

        {isMCQ ? (
          <div className="info-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', marginBottom: '20px' }}>
            <label style={{ marginBottom: '15px', color: 'var(--secondary)', display: 'block' }}>Options & Correct Answer</label>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="radio"
                  name="correctAnswer"
                  value={idx}
                  checked={correctAnswer === String(idx)}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  style={{ width: 'auto' }}
                  required={isMCQ}
                />
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  required={isMCQ}
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                />
              </div>
            ))}
            <small style={{ color: 'var(--text-muted)' }}>* Select the radio button next to the correct answer</small>
          </div>
        ) : (
          <div className="auth-input-group">
            <label>Correct Answer (Ref)</label>
            <input
              type="text"
              placeholder="Brief reference answer for AI evaluation"
              value={correctAnswer}
              onChange={e => setCorrectAnswer(e.target.value)}
              required={!isMCQ}
            />
          </div>
        )}

        {message && (
          <div className={message.includes('successfully') ? 'mt-3' : 'error-card mt-3'}
            style={{
              color: message.includes('successfully') ? 'var(--accent-lime)' : undefined,
              background: message.includes('successfully') ? 'rgba(163, 230, 53, 0.1)' : undefined,
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem'
            }}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
          {loading ? 'Processing...' : 'Create Question'}
        </button>
      </form>
    </div>
  );
};

export default AdminQuestionsPage;
