import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitFeedback, getProfile } from '../utils/api';
import '../styles/index.css';

const FeedbackPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'feedback',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Autofill name and email if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            getProfile(token)
                .then((data) => {
                    if (data.user) {
                        setFormData((prev) => ({
                            ...prev,
                            name: data.user.name || '',
                            email: data.user.email || '',
                        }));
                    }
                })
                .catch((err) => console.error('Failed to fetch profile for autofill', err));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const response = await submitFeedback(formData);
            setSuccess(response.message || 'Feedback submitted successfully!');

            // Trigger confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#06b6d4', '#f472b6', '#a3e635']
            });

            setFormData({
                ...formData,
                subject: '',
                message: '',
            });
        } catch (err) {
            setError(err.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="section"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                    <div style={{ padding: '12px', background: 'var(--primary)', borderRadius: '16px', color: 'white' }}>
                        <MessageSquare size={32} />
                    </div>
                    <div>
                        <h1 className="text-gradient" style={{ margin: 0 }}>Feedback</h1>
                        <p style={{ margin: 0 }}>Help us level up your prep journey.</p>
                    </div>
                </div>

                {success && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-3"
                        style={{
                            color: 'var(--accent-lime)',
                            padding: '1.25rem',
                            background: 'rgba(163, 230, 53, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            border: '1px solid rgba(163, 230, 53, 0.2)'
                        }}
                    >
                        <CheckCircle size={20} /> {success}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="error-card mt-3"
                        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <AlertCircle size={20} /> {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="auth-input-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <label htmlFor="email">Your Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="category">What is this about?</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="feedback">General Feedback</option>
                            <option value="problem">Report a Problem</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Brief summary"
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us what's on your mind... we're listening! 🚀"
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {loading ? 'Submitting...' : <><Send size={18} /> Send Message</>}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default FeedbackPage;
