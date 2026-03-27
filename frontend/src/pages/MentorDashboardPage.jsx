import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const MentorDashboardPage = () => {
    return (
        <div className="app-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section">

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ padding: '12px', background: '#22c55e', borderRadius: '16px', color: 'white' }}>
                        <GraduationCap size={32} />
                    </div>
                    <div>
                        <h1 className="text-gradient" style={{ margin: 0 }}>Mentor Dashboard</h1>
                        <p style={{ margin: 0 }}>Track mentee progress and provide feedback.</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <h3>🚧 Coming Soon</h3>
                    <p>This feature is currently under development.</p>
                </div>

            </motion.div>
        </div>
    );
};

export default MentorDashboardPage;
