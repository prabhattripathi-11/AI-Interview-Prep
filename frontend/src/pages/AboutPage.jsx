import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Target, Users, Code, Award, Rocket } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="app-container">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="section"
                style={{ textAlign: 'center', padding: '4rem 2rem' }}
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
                    }}
                >
                    <Cpu size={48} color="white" />
                </motion.div>

                <h1 className="text-gradient responsive-h1">About NexusAssess</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Your ultimate Gen-Z powered career companion. We bridge the gap between preparation and your dream technical job with cutting-edge AI.
                </p>
            </motion.div>

            {/* Mission Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', color: 'var(--secondary)' }}>
                            <Target size={24} />
                        </div>
                        <h3>Our Mission</h3>
                    </div>
                    <p>
                        To democratize interview preparation by providing free, high-quality, and personalized AI feedback to students and developers worldwide.
                        We believe everyone deserves a fair shot at their dream tech role, regardless of their background.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                            <Zap size={24} />
                        </div>
                        <h3>The Technology</h3>
                    </div>
                    <p>
                        Powered by Google's Gemini Pro models, our platform analyzes your speech, code, and resume in real-time.
                        We use advanced prompt engineering to simulate realistic interviewer personas, from supportive mentors to strict technical leads.
                    </p>
                </motion.div>
            </div>

            {/* Key Features Grid */}
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ textAlign: 'center', margin: '4rem 0 2rem' }}
            >
                What Sets Us Apart
            </motion.h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {[
                    { icon: <Award size={24} />, title: "AI Readiness Score", desc: "Get a quantifiable metric of your interview preparedness based on historical data." },
                    { icon: <Users size={24} />, title: "Mock Interviews", desc: "Voice-enabled simulations that adapt to your answers in real-time." },
                    { icon: <Code size={24} />, title: "Technical Quizzes", desc: "Timed challenges covering DSA, System Design, and Frontend topics." },
                    { icon: <Shield size={24} />, title: "Resume Scanner", desc: "ATS-friendly analysis to ensure your CV gets past the first round." }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                        className="glass-panel"
                        whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                    >
                        <div style={{
                            width: '48px', height: '48px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1rem',
                            color: 'var(--text-main)'
                        }}>
                            {item.icon}
                        </div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.9rem' }}>{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Creator Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="section"
                style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    margin: '0 auto 1.5rem',
                    border: '4px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
                }}>
                    <img
                        src="https://github.com/prabhattripathi-11.png"
                        alt="Prabhat Tripathi"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <h2>Built by Prabhat Tripathi</h2>
                <p style={{ maxWidth: '600px' }}>
                    Full-stack developer passionate about AI and Education.
                    Created Prepfolio to solve the "lack of feedback" problem in the job hunt process.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <a href="https://github.com/prabhattripathi-11" target="_blank" rel="noopener noreferrer" className="cta-button" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>GitHub</a>
                    <a href="https://www.linkedin.com/in/prabhat-tripathi-38b161293/" target="_blank" rel="noopener noreferrer" className="cta-button">LinkedIn</a>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutPage;
