import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login, getProfile } from '../../utils/api';
import AuthThreeScene from '../../components/three/AuthThreeScene';

function LoginPage({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await login(email, password);
      console.log('Login response:', data);
      console.log('User role from login:', data.role);

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setMessage('Login successful');

      if (onSuccess) onSuccess(); // redirect to /dashboard from index.js

      const profile = await getProfile(data.token);
      console.log('Profile data:', profile);
      console.log('User role from profile:', profile.user?.role);
    } catch (err) {
      setMessage(err.message);
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
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="auth-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '2.5rem' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <LogIn className="text-gradient" size={32} />
            </motion.div>
            <span>Welcome Back</span>
          </h1>
          <p className="auth-subtitle" style={{ fontSize: '1.1rem', maxWidth: '300px', margin: '0.5rem auto 2.5rem' }}>
            Log in to practice DSA & behavioral interviews with AI insights.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="auth-input-group"
          >
            <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
              <Mail size={16} className="text-gradient" /> Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
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
                paddingRight: '50px',
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
                right: '15px',
                top: '46px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: 'auto',
                height: 'auto',
                boxShadow: 'none',
                marginTop: 0,
                color: 'var(--text-muted)',
                transition: 'color 0.2s'
              }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </motion.div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: '1.5rem',
                padding: '0.75rem',
                borderRadius: '12px',
                backgroundColor: message.includes('success') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                color: message.includes('success') ? '#4ade80' : '#f87171',
                textAlign: 'center',
                fontSize: '0.9rem',
                border: `1px solid ${message.includes('success') ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`
              }}
            >
              {message}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
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
              background: 'linear-gradient(135deg, var(--primary), var(--primary-glow))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <span>Securing Access...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn size={20} />
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
          New to the platform? <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} onMouseEnter={e => e.target.style.borderColor = 'var(--secondary)'} onMouseLeave={e => e.target.style.borderColor = 'transparent'}>Create an Account</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
