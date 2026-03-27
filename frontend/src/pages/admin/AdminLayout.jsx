import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    MessageSquare,
    PlusCircle,
    LayoutDashboard,
    Shield,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Menu,
    X
} from 'lucide-react';
import { getAdminStats } from '../../utils/api';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats(token);
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        fetchStats();
    }, [token]);

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { path: '/admin/questions', icon: <PlusCircle size={20} />, label: 'Questions' },
        { path: '/admin/feedback', icon: <MessageSquare size={20} />, label: 'User Feedback' },
    ];

    const statsConfig = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: 'var(--primary)' },
        { label: 'Questions', value: stats?.totalQuestions || 0, icon: <PlusCircle size={24} />, color: 'var(--secondary)' },
        { label: 'Feedback', value: stats?.totalFeedback || 0, icon: <MessageSquare size={24} />, color: 'var(--accent-pink)' },
        { label: 'Pending', value: stats?.pendingFeedback || 0, icon: <Bell size={24} />, color: 'var(--accent-orange)' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-deep)', color: 'white' }}>
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '80px' }}
                style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid var(--glass-border)',
                    padding: '2rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    zIndex: 100,
                    transition: 'width 0.3s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem', padding: '0 0.5rem' }}>
                    <div style={{
                        padding: '10px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Shield size={24} color="white" />
                    </div>
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
                        >
                            Admin Console
                        </motion.span>
                    )}
                </div>

                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{ textDecoration: 'none' }}
                            >
                                <motion.div
                                    whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
                                        background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                                        marginBottom: '0.5rem',
                                        position: 'relative',
                                        border: isActive ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid transparent'
                                    }}
                                >
                                    {item.icon}
                                    {isSidebarOpen && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isActive && isSidebarOpen && (
                                        <motion.div
                                            layoutId="active-pill"
                                            style={{
                                                position: 'absolute',
                                                right: '12px',
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: 'var(--secondary)'
                                            }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                        gap: '12px',
                        width: '100%',
                        boxShadow: 'none'
                    }}
                >
                    {isSidebarOpen ? <ChevronRight style={{ transform: 'rotate(180deg)' }} size={20} /> : <ChevronRight size={20} />}
                    {isSidebarOpen && <span>Collapse</span>}
                </button>
            </motion.aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header Aliagned with Sidebar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', margin: 0 }}>
                            Welcome back, <span className="text-gradient">Admin</span>
                        </h1>
                        <p style={{ margin: '0.5rem 0 0' }}>Here's what's happening across the platform today.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search
                                size={18}
                                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    paddingLeft: '40px',
                                    width: '260px',
                                    height: '42px',
                                    fontSize: '0.9rem',
                                    borderRadius: '12px'
                                }}
                            />
                        </div>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: 'var(--glass-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--glass-border)',
                            position: 'relative',
                            cursor: 'pointer'
                        }}>
                            <Bell size={20} />
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'var(--accent-pink)',
                                border: '2px solid var(--bg-deep)'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem'
                }}>
                    {statsConfig.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                borderRadius: '20px',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: `${stat.color}20`,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                
                                
                                justifyContent: 'center'
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stat.label}</p>
                                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Page Content */}
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;
