import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Edit, Save, Trash2, Check, X, Search, Activity, Database, Server, Plus, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../../utils/api';

const AdminDashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editRole, setEditRole] = useState('user');
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL || 'https://nexus-assess-backend.onrender.com';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!res.ok) throw new Error('Failed to update role');

            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            setEditingId(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="spinner-center"><div className="spinner"></div></div>;

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {error && <div className="glass-panel" style={{ color: '#f87171', marginBottom: '1rem', padding: '1rem' }}>{error}</div>}

            {/* Quick Actions & System Status Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* Quick Actions */}
                <div className="glass-panel" style={{ margin: 0 }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Activity size={20} color="var(--primary)" /> Quick Actions
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Link to="/admin/questions" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                style={{
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={24} />
                                <span style={{ fontWeight: 600 }}>Add Question</span>
                            </motion.div>
                        </Link>
                        <Link to="/admin/feedback" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                style={{
                                    background: 'rgba(6, 182, 212, 0.1)',
                                    border: '1px solid rgba(6, 182, 212, 0.2)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--secondary)',
                                    cursor: 'pointer'
                                }}
                            >
                                <MessageSquare size={24} />
                                <span style={{ fontWeight: 600 }}>Feedback</span>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* System Status (Mocked) */}
                <div className="glass-panel" style={{ margin: 0 }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Server size={20} color="var(--accent-lime)" /> System Health
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Database size={16} color="var(--text-muted)" />
                                <span style={{ color: 'var(--text-muted)' }}>Database (MongoDB)</span>
                            </div>
                            <span style={{ color: '#4ade80', fontSize: '0.85rem', background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>Operational</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={16} color="var(--text-muted)" />
                                <span style={{ color: 'var(--text-muted)' }}>AI API (Gemini)</span>
                            </div>
                            <span style={{ color: '#4ade80', fontSize: '0.85rem', background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>Operational</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Server size={16} color="var(--text-muted)" />
                                <span style={{ color: 'var(--text-muted)' }}>Server Latency</span>
                            </div>
                            <span style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>45ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Management Section */}
            <div className="glass-panel" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0 }}>User Management</h3>

                    {/* Search Field */}
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                paddingLeft: '36px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                width: '250px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>USER</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>EMAIL</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>ROLE</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                    whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                                >
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="user-avatar-small" style={{
                                            background: `linear-gradient(135deg, ${user.role === 'admin' ? 'var(--primary)' : '#64748b'}, transparent)`,
                                            width: '36px', height: '36px', fontSize: '0.9rem'
                                        }}>
                                            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="avatar-img" /> : user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member since {new Date(user.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === user._id ? (
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                style={{
                                                    background: 'var(--bg-dark)',
                                                    color: 'white',
                                                    border: '1px solid var(--glass-border)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="mentor">Mentor</option>
                                            </select>
                                        ) : (
                                            <span className={`role-badge role-${user.role}`}>
                                                {user.role === 'admin' && <Shield size={12} style={{ marginRight: '4px' }} />}
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        {editingId === user._id ? (
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleRoleChange(user._id, editRole)}
                                                    className="icon-btn"
                                                    style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)' }}
                                                    title="Save"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="icon-btn"
                                                    style={{ color: '#f87171', background: 'rgba(248, 113, 113, 0.1)' }}
                                                    title="Cancel"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingId(user._id); setEditRole(user.role); }}
                                                className="icon-btn"
                                                title="Edit Role"
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-muted)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
