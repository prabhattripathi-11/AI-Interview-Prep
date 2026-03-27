import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Play,
  PlusCircle,
  MessageSquare,
  LogOut,
  RotateCcw,
  Trophy,
  TrendingUp,
  FileText,
  Mic,
  History as HistoryIcon,
  Zap,
  LayoutDashboard,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { getProfile, getQuizHistory, resetQuizHistory } from '../utils/api';
import HeaderUserMenu from '../components/layout/HeaderUserMenu';
import IntroThreeScene from '../components/three/IntroThreeScene';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('Loading...');
  const [history, setHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token, please login again.');
      return;
    }

    async function fetchUserAndHistory() {
      try {
        const data = await getProfile(token);
        console.log('Dashboard - Profile data:', data);
        console.log('Dashboard - User object:', data.user);
        console.log('Dashboard - User role:', data.user?.role);
        console.log('Dashboard - Is admin?', data.user?.role === 'admin');

        setUser(data.user);
        setMessage('');

        const hist = await getQuizHistory(token);
        setHistory(hist.attempts || []);
      } catch (err) {
        setMessage(err.message);
      }
    }

    fetchUserAndHistory();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  async function handleResetStats() {
    if (!window.confirm('Are you sure you want to reset all your Progress? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await resetQuizHistory(token);
      setHistory([]);
      alert('Progress reset successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to reset progress');
    }
  }

  if (message) {
    return (
      <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p>{message}</p>
      </div>
    );
  }

  // simple stats
  const totalAttempts = history.length;
  const bestScore = totalAttempts
    ? Math.max(...history.map(a => a.score || 0))
    : 0;
  const avgScore = totalAttempts
    ? Math.round(
      history.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts
    )
    : 0;

  // show only last 5 by default
  const attemptsToShow = showAll ? history : history.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Navbar for Dashboard */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          marginBottom: '2rem',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--glass-border)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: 'white' }}>
            <LayoutDashboard size={20} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>NexusAssess</span>
        </div>
        <HeaderUserMenu user={user} />
      </motion.nav>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="app-container"
      >
        {/* Platform Intro & Insights Section */}
        <motion.div
          variants={itemVariants}
          className="glass-panel dashboard-hero-panel"
          style={{
            marginBottom: '3rem',
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '32px'
          }}
        >
          {/* THREE JS BACKGROUND */}
          <IntroThreeScene />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}
            >
              <div style={{ height: '2px', width: '24px', background: 'var(--accent-lime)' }}></div>
              <span style={{
                color: 'var(--accent-lime)',
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.2em'
              }}>
                Neural Interface • Quantum Ready
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="dashboard-hero-title responsive-title-giant"
              style={{ marginBottom: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}
            >
              Secure the Bag. <br />
              <span className="text-gradient" style={{ filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))' }}>Own Your Future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="dashboard-hero-desc"
              style={{ color: '#e2e8f0', maxWidth: '650px', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500 }}
            >
              Hello <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{user?.name?.split(' ')[0]}</span>, it's time to lock in. We've built a high-key powerful AI to transform your technical grind into an unstoppable career flex.
            </motion.p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2.5rem',
            }}>
              {[
                {
                  icon: <Zap size={24} />,
                  title: "Real-Talk AI Logic",
                  text: "AI logic analysis that thinks like a FAANG interviewer. No gatekeeping.",
                  color: "var(--primary)"
                },
                {
                  icon: <TrendingUp size={24} />,
                  title: "Growth Nodes",
                  text: "Track your technical evolution through deep-learning metrics.",
                  color: "var(--accent-pink)"
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  whileHover={{ y: -5 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `color-mix(in srgb, ${feature.color} 15%, transparent)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feature.color,
                    boxShadow: `0 8px 16px -4px ${feature.color}44`
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>{feature.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{feature.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Stats Grid */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <DashboardStat
            label="Total Attempts"
            value={totalAttempts}
            icon={<HistoryIcon size={24} />}
            color="var(--secondary)"
            subtext="Lifetime quizzes"
            trend="+2 this week"
          />
          <DashboardStat
            label="Best Score"
            value={bestScore}
            maxValue={10}
            icon={<Trophy size={24} />}
            color="var(--accent-pink)"
            subtext="Personal record"
            showProgress
          />
          <DashboardStat
            label="Average Score"
            value={avgScore}
            maxValue={10}
            icon={<TrendingUp size={24} />}
            color="var(--accent-lime)"
            subtext="Performance metric"
            showProgress
          />
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <div style={{ width: '3px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
          <motion.h2 variants={itemVariants} style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Quick Actions
          </motion.h2>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem',
          }}
        >
          <ActionCard
            title="Start New Quiz"
            desc="Test your knowledge with AI-generated Feedback."
            icon={<Play size={24} />}
            color="var(--primary)"
            onClick={() => navigate('/quiz')}
            tag="Popular"
          />
          <ActionCard
            title="Mock Interview"
            desc="Practice for your next Interview with our AI interviewer."
            icon={<Mic size={24} />}
            color="var(--accent-purple)"
            onClick={() => navigate('/interview')}
          />
          <ActionCard
            title="Resume Scan"
            desc="Get AI feedback on your resume."
            icon={<FileText size={24} />}
            color="var(--secondary)"
            onClick={() => navigate('/resume')}
          />
          <ActionCard
            title="Analytics"
            desc="Deep dive into your performance stats."
            icon={<TrendingUp size={24} />}
            color="var(--accent-blue)"
            onClick={() => navigate('/analytics')}
          />

          {user?.role === 'admin' && (
            <>
              <ActionCard
                title="Admin: Questions"
                desc="Manage and update the question bank."
                icon={<PlusCircle size={24} />}
                color="var(--accent-lime)"
                onClick={() => navigate('/admin/questions')}
              />
              <ActionCard
                title="Admin: Feedback"
                desc="Review and analyze user feedback."
                icon={<MessageSquare size={24} />}
                color="var(--accent-orange)"
                onClick={() => navigate('/admin/feedback')}
              />
            </>
          )}
        </motion.div>

        {/* Recent History */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HistoryIcon size={24} className="text-gradient" /> Recent Activity
            </h2>
            {history.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--glass-border)',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)'
                }}
              >
                {showAll ? 'Show Less' : 'View All'}
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>No activity yet. Start a quiz to see your history here!</p>
              <button onClick={() => navigate('/quiz')} style={{ marginTop: '1rem' }}>Get Started</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence>
                {attemptsToShow.map((a, idx) => (
                  <motion.div
                    key={a._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="quiz-card"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.25rem',
                      background: 'rgba(255,255,255,0.02)',
                      marginBottom: 0
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: a.score >= 8 ? 'var(--accent-lime)' : (a.score >= 5 ? 'var(--secondary)' : 'var(--accent-pink)')
                      }}>
                        {a.score}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#f1f5f9' }}>
                          Quiz Attempt
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(a.createdAt).toLocaleDateString()} at {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        background: a.score >= 8 ? 'rgba(163, 230, 53, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: a.score >= 8 ? 'var(--accent-lime)' : 'var(--text-muted)'
                      }}>
                        {a.score >= 8 ? 'Excellent' : (a.score >= 5 ? 'Good' : 'Needs Practice')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}
        >
          <button
            onClick={handleResetStats}
            style={{
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem'
            }}
          >
            <RotateCcw size={16} /> Reset Stats
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171', // Red
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}

// Subcomponents

function DashboardStat({ label, value, icon, color, subtext, showProgress, maxValue = 10, trend }) {
  const percentage = showProgress ? (value / maxValue) * 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -5 }}
      style={{
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px -5px ${color}22`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '180px'
      }}
    >
      {/* Background Decorative Mesh */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '120px',
        height: '120px',
        background: color,
        filter: 'blur(50px)',
        opacity: 0.15,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            padding: '12px',
            borderRadius: '16px',
            color: color,
            border: `1px solid ${color}33`,
            boxShadow: `0 8px 16px -4px ${color}44`
          }}>
            {icon}
          </div>
          {trend && (
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent-lime)',
              background: 'rgba(163, 230, 53, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(163, 230, 53, 0.2)'
            }}>
              {trend}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.02em' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {value}
              </span>
              {showProgress && (
                <span style={{ fontSize: '1.1rem', color: 'rgba(148, 163, 184, 0.5)', fontWeight: 700 }}>
                  /{maxValue}
                </span>
              )}
            </div>
          </div>

          {showProgress && (
            <div style={{ width: '60px', height: '60px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="3.5"
                />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${percentage}, 100` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#fff'
              }}>
                {Math.round(percentage)}%
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
        <span style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.6)', fontWeight: 500 }}>
          {subtext}
        </span>
      </div>
    </motion.div>
  );
}

function ActionCard({ title, desc, icon, color, onClick, tag }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.02, translateY: -8 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '28px',
        padding: '2rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isHovered
          ? `0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 30px -5px ${color}33`
          : '0 15px 35px -10px rgba(0, 0, 0, 0.4)',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {/* Dynamic Glow Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '180px',
              height: '180px',
              background: color,
              filter: 'blur(60px)',
              opacity: 0.15,
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            border: `1px solid ${color}33`,
            boxShadow: isHovered ? `0 10px 20px -5px ${color}66` : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {icon}
        </motion.div>

        {tag && (
          <div style={{
            padding: '4px 10px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: 'var(--primary)',
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {tag}
          </div>
        )}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{title}</h3>
          <motion.div
            animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowRight size={20} color={color} />
          </motion.div>
        </div>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: 500, lineHeight: 1.6 }}>
          {desc}
        </p>
      </div>

      {/* Decorative Corner Element */}
      <div style={{
        position: 'absolute',
        bottom: '-10px',
        right: '-10px',
        width: '40px',
        height: '40px',
        background: `linear-gradient(135deg, transparent 50%, ${color}22 100%)`,
        borderRadius: '50%',
        zIndex: 0
      }} />
    </motion.div>
  );
}

export default DashboardPage;
