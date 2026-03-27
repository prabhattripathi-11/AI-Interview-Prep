import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Brain,
  Timer,
  Target,
  Play,
  StopCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Activity,
  Layers,
  ChevronRight,
  MessageSquareQuote
} from 'lucide-react';
import { startQuiz, submitQuiz, getFeedback, getProfile, deleteQuestion } from '../utils/api';
import ReactMarkdown from 'react-markdown';

function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scoreMsg, setScoreMsg] = useState('');
  const [feedbacks, setFeedbacks] = useState({});
  const [results, setResults] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [quizMode, setQuizMode] = useState('mixed');

  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await getProfile(token);
          setCurrentUserId(user._id);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    }
    fetchUser();
  }, []);

  async function handleStartQuiz() {
    try {
      const token = localStorage.getItem('token');
      const data = await startQuiz(token, {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        count: 5,
        quizMode,
      });

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions found for the selected options.');
      }

      setQuizQuestions(data.questions);
      setAnswers({});
      setScoreMsg('');
      setFeedbacks({});
      setResults([]);
      setAiError('');

      setTimeLeft(timerMinutes * 60);
      setTimerRunning(true);
    } catch (err) {
      setScoreMsg(err.message);
    }
  }

  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      if (quizQuestions.length > 0) {
        handleSubmitQuiz();
      }
      return;
    }

    const id = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timerRunning, timeLeft, quizQuestions]);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function handleStopQuiz() {
    if (!window.confirm("Are you sure you want to stop the quiz? All progress will be lost.")) return;
    setQuizQuestions([]);
    setAnswers({});
    setScoreMsg('');
    setFeedbacks({});
    setResults([]);
    setAiError('');
    setTimerRunning(false);
    setTimeLeft(0);
  }

  function handleChangeAnswer(qId, value) {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }

  async function handleSubmitQuiz() {
    try {
      const token = localStorage.getItem('token');
      setAiLoading(true);
      setAiError('');
      setFeedbacks({});
      setTimerRunning(false);

      const payload = quizQuestions.map(q => ({
        questionId: q._id,
        userAnswer: answers[q._id] || '',
      }));
      const data = await submitQuiz(token, payload);
      setScoreMsg(`Score: ${data.score}/10`);
      setResults(data.results || []);

      const newFeedbacks = {};
      for (const q of quizQuestions) {
        const userAnswer = answers[q._id] || '';
        if (!userAnswer) continue;

        try {
          const fb = await getFeedback(token, {
            questionText: q.text,
            userAnswer,
            questionType: q.type || 'DSA',
            options: q.options && q.options.length > 0 ? q.options : null,
          });
          newFeedbacks[q._id] = fb.feedback;
        } catch (err) {
          newFeedbacks[q._id] = 'AI feedback failed for this question.';
        }
      }
      setFeedbacks(newFeedbacks);
    } catch (err) {
      setScoreMsg(err.message);
      setAiError('AI feedback failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = localStorage.getItem('token');
      await deleteQuestion(token, questionId);
      setQuizQuestions(prev => prev.filter(q => q._id !== questionId));
    } catch (err) {
      alert(err.message);
    }
  };

  const submitDisabled = aiLoading || quizQuestions.length === 0 || (!timerRunning && !timeLeft);

  return (
    <div className="section" style={{ position: 'relative', minHeight: '80vh' }}>
      {/* Animated Background Decoration */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '5%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%' }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], x: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '10%', left: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)', filter: 'blur(90px)', borderRadius: '50%' }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            <Activity size={16} /> Knowledge Assessment
          </div>
          <h1 className="responsive-h1" style={{ fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Prep<span className="text-gradient">QuizAI</span>
          </h1>
          <p className="responsive-p-large" style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Tailored challenges designed to test your limits and prepare you for technical excellence.
          </p>
        </motion.div>

        {quizQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '32px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <QuizSelect
                label="Domain"
                value={selectedTopic}
                onChange={setSelectedTopic}
                icon={<Target size={18} />}
                options={['DSA', 'DBMS', 'OOPS', 'Web Development']}
                placeholder="All Topics"
              />
              <QuizSelect
                label="Intensity"
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                icon={<Layers size={18} />}
                options={['easy', 'medium', 'hard']}
                placeholder="Mixed"
              />
              <QuizSelect
                label="Time Limit"
                value={timerMinutes}
                onChange={v => setTimerMinutes(Number(v))}
                icon={<Timer size={18} />}
                options={[5, 10, 15, 20]}
                suffix=" min"
              />
              <QuizSelect
                label="Mode"
                value={quizMode}
                onChange={setQuizMode}
                icon={<Brain size={18} />}
                options={['mixed', 'mcq', 'open']}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartQuiz}
              style={{ width: '100%', height: '64px', fontSize: '1.2rem', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
            >
              <Play size={20} fill="currentColor" /> Initialize Assessment
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {/* Active Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '24px', marginBottom: '2rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Timer size={24} className="text-gradient" />
                <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: timeLeft < 60 ? '#f87171' : '#fff' }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleStopQuiz}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', height: '44px', padding: '0 15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <StopCircle size={18} /> Abort
              </motion.button>
            </motion.div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {quizQuestions.map((q, idx) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel"
                  style={{ padding: '2.5rem', borderRadius: '28px', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Question Metadata */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)' }}>
                        Q{idx + 1}
                      </span>
                      {q.tags && (
                        <span style={{ padding: '4px 12px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                          {Array.isArray(q.tags) ? q.tags[0] : q.tags}
                        </span>
                      )}
                    </div>
                    {currentUserId && q.createdBy === currentUserId && (
                      <button onClick={() => handleDeleteQuestion(q._id)} style={{ background: 'transparent', color: '#ef4444', padding: '4px', boxShadow: 'none' }}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem', lineHeight: 1.4 }}>{q.text}</h3>

                  {q.options && q.options.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {q.options.map((opt, i) => (
                        <motion.label
                          key={i}
                          whileHover={{ x: 4 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '1.25rem 1.5rem',
                            background: answers[q._id] === opt ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid',
                            borderColor: answers[q._id] === opt ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <input
                            type="radio"
                            name={`q-${q._id}`}
                            value={opt}
                            checked={answers[q._id] === opt}
                            onChange={e => handleChangeAnswer(q._id, e.target.value)}
                            disabled={!timerRunning}
                            style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '1rem', fontWeight: 500, color: answers[q._id] === opt ? '#fff' : '#cbd5e1' }}>{opt}</span>
                        </motion.label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      placeholder="Type your technical analysis here..."
                      value={answers[q._id] || ''}
                      onChange={e => handleChangeAnswer(q._id, e.target.value)}
                      disabled={!timerRunning}
                      style={{ width: '100%', minHeight: '120px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', color: '#fff', fontSize: '1rem', fontFamily: 'Inter' }}
                    />
                  )}

                  {/* AI Feedback Section */}
                  <AnimatePresence>
                    {feedbacks[q._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '16px', borderLeft: '4px solid var(--secondary)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--secondary)' }}>
                          <MessageSquareQuote size={18} />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Intelligence Report</span>
                        </div>
                        <div className="markdown-content" style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#e2e8f0' }}>
                          <ReactMarkdown>{feedbacks[q._id]}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmitQuiz}
                disabled={submitDisabled}
                style={{ height: '64px', minWidth: '240px', fontSize: '1.1rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'linear-gradient(135deg, var(--primary), #6366f1)' }}
              >
                {aiLoading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Analyzing Performance...
                  </>
                ) : (
                  <>Complete Assessment <ChevronRight size={20} /></>
                )}
              </motion.button>
            </div>
          </div>
        )}

        {/* Global Result Overlay */}
        <AnimatePresence>
          {scoreMsg && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, padding: '1.5rem 3rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--accent-lime)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={32} color="var(--accent-lime)" />
                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.6 }}>Assessment Score</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{scoreMsg.replace('Score: ', '').replace('Your score: ', '')}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {aiError && (
          <div className="quiz-card mt-3 error-card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <XCircle size={20} /> {aiError}
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponent for cleaner JSX
function QuizSelect({ label, value, onChange, icon, options, placeholder, suffix = "" }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          {icon}
        </div>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '100%', height: '54px', padding: '0 16px 0 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '1rem', cursor: 'pointer', appearance: 'none' }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt} value={opt} style={{ background: '#0f172a' }}>{opt}{suffix}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default QuizPage;
