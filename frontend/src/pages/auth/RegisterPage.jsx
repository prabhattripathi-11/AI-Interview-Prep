import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { register, getProfile } from '../../utils/api';
import AuthThreeScene from '../../components/three/AuthThreeScene';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setMessage('All fields are required');
            return;
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const data = await register(name, email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            setMessage('Registration successful! Redirecting...');

            try {
                await getProfile(data.token);
            } catch (err) {
                console.warn('Profile fetch after register failed', err);
            }

            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            console.error('Registration error:', err);
            setMessage(err.message || 'Registration failed');
            setLoading(false);
        }
    }

    return (
        <div className="auth-page" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Dynamic Auth Background */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.7 }}>
                <AuthThreeScene />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="auth-card"
                style={{ maxWidth: '520px' }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="auth-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                        >
                            <UserPlus className="text-gradient" size={32} />
                        </motion.div>
                        <span>Create Account</span>
                    </h1>
                    <p className="auth-subtitle" style={{ fontSize: '1.1rem', maxWidth: '350px', margin: '0.5rem auto 2.5rem' }}>
                        Join the elite circle of prep-masters with AI-powered coaching.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="auth-input-group"
                        >
                            <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                <User size={16} className="text-gradient" /> Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Genius Candidate"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '1.1rem 1.5rem'
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                            className="auth-input-group"
                        >
                            <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                <Mail size={16} className="text-gradient" /> Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="future@tech.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '1.1rem 1.5rem'
                                }}
                            />
                        </motion.div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="auth-input-group"
                                style={{ position: 'relative' }}
                            >
                                <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                    <Lock size={16} className="text-gradient" /> Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{
                                        paddingRight: '45px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        padding: '1.1rem 1.5rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '46px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        width: 'auto',
                                        height: 'auto',
                                        boxShadow: 'none',
                                        marginTop: 0,
                                        color: 'var(--text-muted)'
                                    }}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.45 }}
                                className="auth-input-group"
                            >
                                <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                    Confirm
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        padding: '1.1rem 1.5rem'
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '1.5rem',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                backgroundColor: message.includes('successful') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                                color: message.includes('successful') ? '#4ade80' : '#f87171',
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                border: `1px solid ${message.includes('successful') ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`
                            }}
                        >
                            {message}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            height: '56px',
                            fontSize: '1.1rem',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, var(--secondary), #0891b2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginTop: '2rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                <span>Securing Profile...</span>
                            </>
                        ) : (
                            <>
                                <span>Get Started</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}
                >
                    Part of the squad? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} onMouseEnter={e => e.target.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.target.style.borderColor = 'transparent'}>Sign In</Link>
                </motion.p>
            </motion.div>
        </div>
    );
}

export default RegisterPage;
