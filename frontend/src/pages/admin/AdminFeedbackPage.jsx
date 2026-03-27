import React, { useEffect, useState } from 'react';
import { getFeedbacks, replyToFeedback } from '../../utils/api';
import '../../styles/index.css';

const AdminFeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const fetchFeedbacks = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please login.');
            setLoading(false);
            return;
        }

        try {
            const data = await getFeedbacks(token);
            setFeedbacks(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch feedback');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleShowReplyBox = (id, existingReply = '') => {
        setReplyingTo(id);
        setReplyText(existingReply);
    };

    const handleSendReply = async (id) => {
        if (!replyText.trim()) return;
        setSending(true);
        const token = localStorage.getItem('token');
        try {
            await replyToFeedback(token, id, replyText);
            setReplyingTo(null);
            setReplyText('');
            // Refresh list
            fetchFeedbacks();
        } catch (err) {
            alert(err.message);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="app-container">
                <div className="section">
                    <p>Loading feedback...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-container">
                <div className="section">
                    <div className="error-card">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="section">
                <h1 className="text-gradient">User Feedback</h1>
                <p>Manage and review feedback submitted by users.</p>

                {feedbacks.length === 0 ? (
                    <p>No feedback found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Category</th>
                                    <th style={{ padding: '1rem' }}>Subject</th>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((fb) => (
                                    <React.Fragment key={fb._id}>
                                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <strong>{fb.name}</strong><br />
                                                <small style={{ color: 'var(--text-muted)' }}>{fb.email}</small>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    background: fb.category === 'problem' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                                    color: fb.category === 'problem' ? '#fca5a5' : '#c4b5fd'
                                                }}>
                                                    {fb.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>{fb.subject}</td>
                                            <td style={{ padding: '1rem' }}>{new Date(fb.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)' }}>
                                                <div style={{ marginBottom: '1rem' }}>
                                                    <p style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '0.95rem' }}>"{fb.message}"</p>
                                                </div>

                                                {fb.adminReply ? (
                                                    <div style={{
                                                        background: 'rgba(139, 92, 246, 0.1)',
                                                        borderLeft: '4px solid var(--primary)',
                                                        padding: '12px 16px',
                                                        borderRadius: '0 8px 8px 0',
                                                        marginTop: '10px'
                                                    }}>
                                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>ADMIN REPLY - {new Date(fb.repliedAt).toLocaleString()}</p>
                                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#e5e7eb' }}>{fb.adminReply}</p>
                                                        <button
                                                            onClick={() => handleShowReplyBox(fb._id, fb.adminReply)}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                padding: '4px 0',
                                                                fontSize: '0.75rem',
                                                                color: 'var(--secondary)',
                                                                textTransform: 'none',
                                                                boxShadow: 'none',
                                                                marginTop: '4px'
                                                            }}
                                                        >
                                                            Edit Reply
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleShowReplyBox(fb._id)}
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            padding: '0.5rem 1rem',
                                                            background: 'linear-gradient(135deg, var(--secondary), #0891b2)'
                                                        }}
                                                    >
                                                        Add Reply
                                                    </button>
                                                )}

                                                {replyingTo === fb._id && (
                                                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                                                        <textarea
                                                            placeholder="Type your reply..."
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            rows="4"
                                                            style={{ marginBottom: '1rem' }}
                                                        />
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button
                                                                onClick={() => handleSendReply(fb._id)}
                                                                disabled={sending}
                                                                style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}
                                                            >
                                                                {sending ? 'Sending...' : 'Send Reply'}
                                                            </button>
                                                            <button
                                                                className="btn-danger"
                                                                onClick={() => setReplyingTo(null)}
                                                                style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFeedbackPage;
