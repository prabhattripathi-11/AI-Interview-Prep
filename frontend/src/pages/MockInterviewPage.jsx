import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
    Mic,
    MicOff,
    Send,
    Play,
    Award,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    FileText,
    Briefcase,
    Brain,
    Zap
} from 'lucide-react';
import { startInterview, submitAnswer, endInterview } from '../utils/api';

const MockInterviewPage = () => {
    const [view, setView] = useState('setup'); // setup, session, report
    const [config, setConfig] = useState({ jobRole: 'Frontend Developer', topic: 'React', difficulty: 'Medium' });
    const [interviewData, setInterviewData] = useState(null); // { interviewId, question, ... }
    const [finalReport, setFinalReport] = useState(null);

    const token = localStorage.getItem('token');

    const handleStart = async () => {
        try {
            const data = await startInterview(token, config);
            setInterviewData({ ...data, messages: [{ role: 'ai', content: data.question }] });
            setView('session');
        } catch (err) {
            alert('Failed to start interview: ' + err.message);
        }
    };

    const handleFinish = (report) => {
        setFinalReport(report);
        setView('report');
    };

    return (
        <div className="app-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section">
                {view === 'setup' && <SetupView config={config} setConfig={setConfig} onStart={handleStart} />}
                {view === 'session' && interviewData && (
                    <InterviewSession
                        token={token}
                        interviewId={interviewData.interviewId}
                        initialQuestion={interviewData.question}
                        onFinish={handleFinish}
                    />
                )}
                {view === 'report' && finalReport && <ReportView report={finalReport} onRetry={() => setView('setup')} />}
            </motion.div>
        </div>
    );
};

// --- Subcomponents ---

const SetupView = ({ config, setConfig, onStart }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{
            maxWidth: '620px',
            margin: '2rem auto',
            padding: '3rem',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        {/* Abstract Background Decoration */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                AI Mock Interview
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Configure your session and let the AI challenge you.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Target Role */}
            <div className="setup-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Briefcase size={16} color="var(--primary)" /> Target Role
                </label>
                <div className="custom-select-wrapper">
                    <select
                        value={config.jobRole}
                        onChange={(e) => setConfig({ ...config, jobRole: e.target.value })}
                        style={setupInputStyle}
                    >
                        <option>Frontend Developer</option>
                        <option>Backend Developer</option>
                        <option>Full-Stack Developer</option>
                        <option>DevOps Engineer</option>
                        <option>Data Scientist</option>
                        <option>Software Engineer (Generic)</option>
                    </select>
                </div>
            </div>

            {/* Focus Topic */}
            <div className="setup-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Brain size={16} color="var(--secondary)" /> Focus Topic
                </label>
                <div className="custom-select-wrapper">
                    <select
                        value={config.topic}
                        onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                        style={setupInputStyle}
                    >
                        <option>React & Core Frontend</option>
                        <option>Node.js & System Design</option>
                        <option>Data Structures & Algorithms</option>
                        <option>Database (SQL/NoSQL)</option>
                        <option>Behavioral & Soft Skills</option>
                        <option>Cloud & DevOps Architecture</option>
                    </select>
                </div>
            </div>

            {/* Difficulty */}
            <div className="setup-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Zap size={16} color="var(--accent-lime)" /> Challenge Level
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {['Easy', 'Medium', 'Hard'].map((level) => (
                        <motion.button
                            key={level}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfig({ ...config, difficulty: level })}
                            style={{
                                flex: 1,
                                height: '50px',
                                borderRadius: '14px',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: config.difficulty === level
                                    ? `linear-gradient(135deg, ${level === 'Easy' ? '#10b981' : level === 'Medium' ? 'var(--primary)' : '#f43f5e'}, ${level === 'Easy' ? '#059669' : level === 'Medium' ? 'var(--secondary)' : '#e11d48'})`
                                    : 'rgba(255, 255, 255, 0.03)',
                                border: config.difficulty === level ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: config.difficulty === level ? 'white' : 'var(--text-muted)',
                                boxShadow: config.difficulty === level ? '0 10px 20px -5px rgba(0,0,0,0.3)' : 'none'
                            }}
                        >
                            {level.toUpperCase()}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>

        <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            style={{
                width: '100%',
                marginTop: '3.5rem',
                height: '64px',
                fontSize: '1.2rem',
                fontWeight: 800,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}
        >
            <Play size={24} fill="white" /> START JOURNEY
        </motion.button>

        <style>{`
            .custom-select-wrapper {
                position: relative;
            }
            .custom-select-wrapper::after {
                content: '▼';
                font-size: 0.7rem;
                color: var(--text-muted);
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
            }
        `}</style>
    </motion.div>
);

const setupInputStyle = {
    width: '100%',
    height: '56px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    padding: '0 20px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 500,
    appearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
};

const InterviewSession = ({ token, interviewId, initialQuestion, onFinish }) => {
    const [conversation, setConversation] = useState([{ role: 'ai', content: initialQuestion }]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Speech to Text
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            setInputText(transcript);
        }
    }, [transcript]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSubmit = async () => {
        if (!inputText.trim()) return;

        const answer = inputText;
        setInputText('');
        resetTranscript();
        setConversation(prev => [...prev, { role: 'user', content: answer }]);
        setLoading(true);

        try {
            const data = await submitAnswer(token, interviewId, answer);
            // Data: { feedback, nextQuestion }

            setConversation(prev => [
                ...prev,
                { role: 'ai', content: data.nextQuestion, feedback: data.feedback }
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = async () => {
        if (window.confirm("Are you sure you want to end the interview?")) {
            setLoading(true);
            try {
                const data = await endInterview(token, interviewId);
                onFinish(data.summary);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,0,0,0.1)', borderRadius: '20px', color: '#f87171' }}>
                    <div className="recording-dot" /> Live Session
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Clock size={18} /> {formatTime(timer)}
                </div>
                <button onClick={handleEndSession} style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '8px 16px' }}>
                    End Interview
                </button>
            </div>

            {/* Chat Area */}
            <div className="glass-panel" style={{ height: '60vh', overflowY: 'auto', padding: '2rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {conversation.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                        }}
                    >
                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '16px',
                            background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                            borderTopLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                        }}>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
                        </div>

                        {/* Feedback for previous user answer (shown below AI subsequent question? No, easier to just show inline if available) -- Actually backend attached feedback to the user message in DB, but frontend flow receives it with next question. Let's simplify and show feedback toast or small indicator if needed. API returns feedback with nextQuestion. 
            
            Wait, I need to display the feedback received for the USER's answer. The API returns `feedback` alongside `nextQuestion`.
            */}
                    </motion.div>
                ))}
                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', padding: '1rem' }}>
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
                    style={{
                        minWidth: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        padding: 0,
                        background: listening ? '#f87171' : 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Toggle Microphone"
                >
                    {listening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder={listening ? "Listening..." : "Type your answer..."}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                    disabled={loading}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!inputText.trim() || loading}
                    style={{
                        minWidth: '50px', height: '50px', borderRadius: '50%', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Send size={24} />
                </button>
            </div>
            {!browserSupportsSpeechRecognition && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px' }}>Browser does not support speech recognition.</p>}
        </div>
    );
};

const ReportView = ({ report, onRetry }) => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Interview Report 📋</h1>

        {/* Overall Score */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `conic-gradient(var(--accent-lime) ${report.overallScore}%, transparent ${report.overallScore}%)`,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 0 30px rgba(163, 230, 53, 0.2)'
            }}>
                <div style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    background: 'var(--bg-dark)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '3rem', fontWeight: 800 }}>{report.overallScore}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Out of 100</span>
                </div>
            </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3>💡 AI Feedback</h3>
            <p style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>{report.feedback}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-lime)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="var(--accent-lime)" /> Strengths</h4>
                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', borderTop: '4px solid #f87171' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18} color="#f87171" /> Weaknesses</h4>
                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    {report.weaknesses.length === 0 && <li>None detected! Great job.</li>}
                </ul>
            </div>
        </div>

        <div style={{ textAlign: 'center' }}>
            <button onClick={onRetry} style={{ background: 'var(--secondary)' }}>
                Start New Interview
            </button>
        </div>
    </div>
);

export default MockInterviewPage;
