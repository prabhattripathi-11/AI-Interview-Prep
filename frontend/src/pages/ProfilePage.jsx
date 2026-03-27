import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Save, Info, CheckCircle, AlertCircle, Layout } from 'lucide-react';
import { getProfile, updateProfile } from '../utils/api';

function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    bio: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const data = await getProfile(token);
        const u = data.user;
        setForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          avatarUrl: u.avatarUrl || '',
          bio: u.bio || '',
        });
      } catch (err) {
        setMessage(err.message);
      }
    })();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'AI-Interview-prep');
      data.append('folder', 'ai-interview-avatars');

      const cloudName = 'ddtdfsn3f';
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Image upload failed');
      }

      const url = json.secure_url;
      const updated = { ...form, avatarUrl: url };
      setForm(updated);

      const token = localStorage.getItem('token');
      await updateProfile(token, updated);

      setMessage('Profile picture updated successfully');
    } catch (err) {
      console.error('Avatar upload error:', err);
      setMessage(err.message || 'Avatar upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await updateProfile(token, form);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-container"
      style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '2.5rem'
      }}
    >
      {/* Sidebar Section */}
      <div className="profile-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 2rem' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid var(--primary)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
                background: 'var(--bg-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt={form.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={80} color="var(--primary)" />
              )}
            </motion.div>

            <label
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'var(--primary)',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                border: '3px solid var(--bg-surface)'
              }}
            >
              {uploading ? (
                <div className="spinner" style={{ width: '18px', height: '18px', border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Camera size={20} color="white" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.02em' }}>{form.name || 'User Name'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>{form.email}</p>

          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Layout size={16} /> ABOUT ME
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {form.bio || 'Your bio will appear here. Tell the world about your coding journey...'}
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
            <Info size={18} /> Quick Setup
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn-sidebar-secondary">
              <CheckCircle size={18} /> Account Status: Active
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Section */}
      <div className="profile-main">
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '3.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <User size={28} color="var(--primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0', letterSpacing: '-0.03em' }}>User Settings</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Customize your professional identity</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="form-item">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={18} />
                <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Full Name" />
              </div>
            </div>

            <div className="form-item">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="form-item">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <Phone size={18} />
                <input name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="+91 XXXX-XXXXXX" />
              </div>
            </div>

            <div className="form-item">
              <label>Custom Profile URL</label>
              <div className="input-wrapper">
                <Camera size={18} />
                <input name="avatarUrl" type="text" value={form.avatarUrl} onChange={handleChange} placeholder="https://image-url.com" />
              </div>
            </div>
          </div>

          <div className="form-item" style={{ marginBottom: '3rem' }}>
            <label>Professional Bio</label>
            <div className="input-wrapper large">
              <Layout size={18} style={{ marginTop: '14px' }} />
              <textarea name="bio" rows="5" value={form.bio} onChange={handleChange} placeholder="Tell us about yourself..." />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    background: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    color: message.includes('success') ? '#10b981' : '#f43f5e',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600',
                    border: message.includes('success') ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)'
                  }}
                >
                  {message.includes('success') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message}
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-save"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : <><Save size={20} /> Update Profile</>}
            </motion.button>
          </div>
        </form>
      </div>

      <style>{`
        .profile-container {
          font-family: 'Inter', sans-serif;
        }
        .form-item label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 0 1.25rem;
          transition: all 0.3s ease;
        }
        .input-wrapper.large {
          align-items: flex-start;
          padding-top: 5px;
        }
        .input-wrapper svg {
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .input-wrapper input, .input-wrapper textarea {
          width: 100%;
          background: transparent !important;
          border: none !important;
          padding: 14px 12px !important;
          color: white !important;
          font-size: 1rem !important;
          outline: none !important;
        }
        .input-wrapper:focus-within {
          border-color: var(--primary);
          background: rgba(139, 92, 246, 0.05);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
        }
        .input-wrapper:focus-within svg {
          color: var(--primary);
        }
        .btn-sidebar-secondary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          border-radius: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-save {
          padding: 1rem 3rem;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }
        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .profile-container {
            grid-template_columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default ProfilePage;
