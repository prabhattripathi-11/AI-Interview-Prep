import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Upload,
    CheckCircle,
    AlertCircle,
    Briefcase,
    Cpu,
    Code,
    HelpCircle,
    RefreshCw,
    X
} from 'lucide-react';
import { analyzeResume, getResumeAnalysis } from '../utils/api';

const ResumePage = () => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');

    // Upload State
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('Frontend Developer');
    const fileInputRef = useRef(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const data = await getResumeAnalysis(token);
            setResumeData(data);
        } catch (err) {
            // Ignore 404 (no resume yet)
            if (!err.message.includes('No resume')) {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
            setError('');
        } else {
            setError('Please upload a valid PDF file.');
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select a file');

        try {
            setAnalyzing(true);
            setError('');

            const formData = new FormData();
            formData.append('resume', file);
            formData.append('targetRole', targetRole);

            const data = await analyzeResume(token, formData);
            setResumeData(data);
            setFile(null); // Clear file after success
        } catch (err) {
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    // Re-analyze mode
    const resetUpload = () => {
        setResumeData(null);
        setFile(null);
    };

    if (loading) return <div className="spinner-center"><div className="spinner"></div></div>;

    return (
        <div className="app-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section"
            >
                <Header />

                {!resumeData && !analyzing ? (
                    <UploadView
                        file={file}
                        handleFileChange={handleFileChange}
                        fileInputRef={fileInputRef}
                        targetRole={targetRole}
                        setTargetRole={setTargetRole}
                        handleAnalyze={handleAnalyze}
                        error={error}
                    />
                ) : analyzing ? (
                    <AnalyzingView />
                ) : resumeData && resumeData.skills ? (
                    <AnalysisResultView
                        data={resumeData}
                        onReUpload={resetUpload}
                    />
                ) : (
                    <UploadView
                        file={file}
                        handleFileChange={handleFileChange}
                        fileInputRef={fileInputRef}
                        targetRole={targetRole}
                        setTargetRole={setTargetRole}
                        handleAnalyze={handleAnalyze}
                        error={error || 'Incomplete analysis data received. Please try again.'}
                    />
                )}
            </motion.div>
        </div>
    );
};

// --- Subcomponents ---

const Header = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <div style={{ padding: '12px', background: 'var(--primary)', borderRadius: '16px', color: 'white' }}>
            <FileText size={32} />
        </div>
        <div>
            <h1 className="text-gradient responsive-h1" style={{ margin: 0 }}>Resume AI Scanner</h1>
            <p style={{ margin: 0 }}>Get comprehensive feedback & interview prep.</p>
        </div>
    </div>
);

const UploadView = ({ file, handleFileChange, fileInputRef, targetRole, setTargetRole, handleAnalyze, error }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{ maxWidth: '600px', margin: '0 auto' }}
    >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Upload Your Resume</h2>

        <div className="auth-input-group">
            <label><Briefcase size={16} /> Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full-Stack Developer</option>
                <option>AI/ML Engineer</option>
                <option>DevOps Engineer</option>
                <option>Data Scientist</option>
            </select>
        </div>

        <div
            className="upload-zone"
            onClick={() => fileInputRef.current.click()}
            style={{
                border: '2px dashed var(--glass-border)',
                borderRadius: '16px',
                padding: '2rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)',
                marginBottom: '1.5rem',
                transition: 'all 0.3s ease'
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                style={{ display: 'none' }}
            />
            {file ? (
                <div style={{ color: 'var(--accent-lime)' }}>
                    <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 600 }}>{file.name}</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ready to scan</p>
                </div>
            ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                    <Upload size={48} style={{ marginBottom: '1rem' }} />
                    <p>Click to upload (PDF only)</p>
                </div>
            )}
        </div>

        {error && <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <button
            onClick={handleAnalyze}
            disabled={!file}
            style={{ width: '100%', opacity: file ? 1 : 0.5 }}
        >
            Analyze Resume 🚀
        </button>
    </motion.div>
);

const AnalyzingView = () => (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                borderRadius: ["20%", "50%", "20%"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary)',
                margin: '0 auto 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Cpu size={40} color="white" />
        </motion.div>
        <h2>Scanning your resume...</h2>
        <p>Using AI to match skills, analyzing gaps, and generating questions.</p>
    </div>
);

const AnalysisResultView = ({ data, onReUpload }) => (
    <div>
        {/* Header Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

            {/* Match Score */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel"
                style={{ textAlign: 'center', borderTop: `4px solid ${getScoreColor(data.matchScore)}` }}
            >
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Match Score</div>
                <div className="responsive-h1" style={{ fontWeight: 800, color: 'white' }}>{data.matchScore}%</div>
                <div style={{ fontSize: '0.8rem', color: getScoreColor(data.matchScore) }}>
                    {data.matchScore > 80 ? 'Excellent Match!' : data.matchScore > 60 ? 'Good Potential' : 'Needs Improvement'}
                </div>
            </motion.div>

            {/* Strong Skills */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-panel"
                style={{ padding: '1.5rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--accent-lime)' }}>
                    <CheckCircle size={18} /> Strong Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {data.skills?.strong?.length > 0 ? data.skills.strong.map(s => (
                        <span key={s} className="tag-pill" style={{ background: 'rgba(163, 230, 53, 0.1)', color: 'var(--accent-lime)' }}>{s}</span>
                    )) : <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No strong matches found.</p>}
                </div>
            </motion.div>

            {/* Missing Skills */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-panel"
                style={{ padding: '1.5rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#f87171' }}>
                    <AlertCircle size={18} /> Missing / Weak
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {data.skills?.missing?.length > 0 ? data.skills.missing.map(s => (
                        <span key={s} className="tag-pill" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}>{s}</span>
                    )) : <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No critical gaps found!</p>}
                </div>
            </motion.div>
        </div>

        {/* Generated Interview Questions */}
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle className="text-gradient" /> Tailored Questions
        </h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
            {data.generatedQuestions?.length > 0 ? data.generatedQuestions.map((q, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel"
                    style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: 'var(--secondary)',
                            fontWeight: 700
                        }}>
                            {q.type}
                        </span>
                        {q.context && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Context: {q.context}
                            </span>
                        )}
                    </div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>"{q.question}"</p>
                </motion.div>
            )) : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No tailored questions generated.</p>}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <button
                onClick={onReUpload}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
            >
                <RefreshCw size={16} /> Scan Another Resume
            </button>
        </div>
    </div>
);

const getScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-lime)';
    if (score >= 50) return '#facc15'; // yellow
    return '#f87171'; // red
};

export default ResumePage;
