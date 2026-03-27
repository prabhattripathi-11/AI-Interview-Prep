import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  MessageSquare,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { getProfile } from '../../utils/api';

function HeaderUserMenu({ user: propUser }) {
  const [user, setUser] = useState(propUser || null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const data = await getProfile(token);
        setUser(data.user);
      } catch (err) {
        console.error('Header profile load error:', err);
      }
    })();
  }, [propUser]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (!user) return null;

  const initials = (user.name || 'U')
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 6px 4px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '100px',
          cursor: 'pointer',
          color: 'white',
          height: '46px'
        }}
      >
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: '0.85rem',
          color: 'var(--text-main)',
        }}>
          {user.name.split(' ')[0]}
        </div>

        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: user.avatarUrl ? 'transparent' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(255, 255, 255, 0.2)'
        }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '12px' }}>{initials}</span>
          )}
        </div>

        <ChevronDown
          size={14}
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 10px)',
              width: '260px',
              background: 'rgba(10, 15, 30, 0.9)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: '24px',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 100
            }}
          >
            {/* Header Info */}
            <div style={{
              padding: '12px 14px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{user.name}</div>
                {user.role === 'admin' && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    color: 'var(--primary)',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Admin
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
            </div>

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {user.role === 'admin' && (
                <MenuButton
                  icon={<ShieldCheck size={18} />}
                  label="Admin Console"
                  onClick={() => { navigate('/admin'); setOpen(false); }}
                  highlight="var(--primary)"
                />
              )}

              <MenuButton
                icon={<User size={18} />}
                label="My Profile"
                onClick={() => { navigate('/profile'); setOpen(false); }}
              />

              <MenuButton
                icon={<MessageSquare size={18} />}
                label="Give Feedback"
                onClick={() => { navigate('/feedback'); setOpen(false); }}
              />

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)', margin: '8px 4px' }} />

              <MenuButton
                icon={<LogOut size={18} />}
                label="Sign Out"
                onClick={handleLogout}
                highlight="#f87171"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({ icon, label, onClick, highlight }) {
  return (
    <motion.button
      whileHover={{ x: 4, background: 'rgba(255, 255, 255, 0.06)' }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: '14px',
        border: 'none',
        background: 'transparent',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        color: highlight ? highlight : '#e5e7eb',
        fontWeight: highlight ? 600 : 500,
        fontSize: '0.9rem',
        transition: 'color 0.2s ease'
      }}
    >
      <span style={{ color: highlight ? highlight : 'var(--text-muted)' }}>{icon}</span>
      {label}
    </motion.button>
  );
}

export default HeaderUserMenu;
