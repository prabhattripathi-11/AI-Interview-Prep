import React, { useState } from 'react';

const API_BASE = 'https://nexus-assess-backend.onrender.com';

function AdminQuestionsPage() {
  const [form, setForm] = useState({
    text: '',
    type: 'dsa',
    topic: '',
    company: '',
    difficulty: 'easy',
  });
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Please paste your admin JWT token first.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || `Error: ${res.status}`);
        return;
      }

      const created = await res.json();
      setMessage(`Question created with id: ${created._id}`);
      setForm({
        text: '',
        type: 'dsa',
        topic: '',
        company: '',
        difficulty: 'easy',
      });
    } catch (err) {
      console.error(err);
      setMessage('Network error');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin: Add Question</h2>

      <div style={{ marginBottom: '16px' }}>
        <label>Authentication Token (Auto-filled):</label>
        <br />
        <input
          type="text"
          value={token}
          readOnly
          style={{ width: '100%', padding: '8px', backgroundColor: '#f3f4f6', color: '#6b7280' }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Question Text</label>
          <br />
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Type</label>
          <br />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ padding: '8px' }}
          >
            <option value="dsa">DSA</option>
            <option value="system-design">System Design</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Topic</label>
          <br />
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Company</label>
          <br />
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Difficulty</label>
          <br />
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            style={{ padding: '8px' }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>
          Create Question
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '16px' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AdminQuestionsPage;
