import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Activity, TrendingUp, Award, Zap, Lightbulb } from 'lucide-react';
import { getAnalytics } from '../utils/api';

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const res = await getAnalytics(token);
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="spinner-center"><div className="spinner"></div></div>;

    if (!data) return <div className="text-center p-5">Failed to load analytics.</div>;

    return (
        <div className="app-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section">

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ padding: '12px', background: 'var(--accent-purple)', borderRadius: '16px', color: 'white' }}>
                        <Activity size={32} />
                    </div>
                    <div>
                        <h1 className="text-gradient" style={{ margin: 0 }}>Progress Analytics</h1>
                        <p style={{ margin: 0 }}>Visualize your growth and master your skills.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <StatCard
                        icon={<Zap size={24} color="#facc15" />}
                        value={data.stats.avgScore + '%'}
                        label="Average Score"
                    />
                    <StatCard
                        icon={<TrendingUp size={24} color="#a3e635" />}
                        value={data.stats.totalQuizzes}
                        label="Quizzes Taken"
                    />
                    <StatCard
                        icon={<Award size={24} color="#f472b6" />}
                        value={data.stats.totalInterviews}
                        label="Interviews Completed"
                    />
                </div>

                {/* AI Insight */}
                {data.insights && (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel"
                        style={{
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            borderLeft: '4px solid var(--accent-purple)',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Lightbulb size={32} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-purple)' }}>AI Performance Insight</h3>
                            <p style={{ margin: 0, lineHeight: 1.6, fontSize: '1.1rem' }}>{data.insights}</p>
                        </div>
                    </motion.div>
                )}

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                    {/* Timeline Chart */}
                    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>📈 Accuracy Trend</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <LineChart data={data.timeline}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => new Date(str).toLocaleDateString()}
                                        stroke="var(--text-muted)"
                                    />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="var(--accent-blue)"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: 'var(--accent-blue)' }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Mastery Chart */}
                    <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>🧠 Topic Mastery</h3>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={data.mastery} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
                                    <YAxis type="category" dataKey="topic" width={120} stroke="var(--text-muted)" />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                    <Bar dataKey="score" fill="var(--accent-purple)" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

const StatCard = ({ icon, value, label }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</div>
        </div>
    </div>
);

export default AnalyticsPage;
