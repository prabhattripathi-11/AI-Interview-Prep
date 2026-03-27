import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUp, ChevronLeft } from 'lucide-react';
import './styles/index.css';
import './styles/App.css';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import QuizPage from './pages/QuizPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import ProfilePage from './pages/ProfilePage';
import FeedbackPage from './pages/FeedbackPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import ResumePage from './pages/ResumePage';
import MockInterviewPage from './pages/MockInterviewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import MentorDashboardPage from './pages/MentorDashboardPage';
import HeaderUserMenu from './components/layout/HeaderUserMenu';
import ChatbotWidget from './components/ChatbotWidget';
import AdminLayout from './pages/admin/AdminLayout';
import Footer from './components/layout/Footer';
import AboutPage from './pages/AboutPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginWrapper />} />
      <Route path="/login" element={<LoginWrapper />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminQuestionsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <FeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminFeedbackPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <MockInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={['mentor', 'admin']}>
            <MentorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  return <LoginPage onSuccess={() => navigate('/dashboard')} />;
}

function MainLayout() {
  const location = useLocation();
  // Hide global header on dashboard and admin pages for cleaner layout
  // We also hide it if we are in admin sub-paths
  const hideHeader = location.pathname === '/dashboard' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/quiz' ||
    location.pathname === '/interview' ||
    location.pathname === '/analytics' ||
    location.pathname === '/about';

  // We should also hide footer on admin pages for a dashboard feel
  const hideFooter = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!hideHeader && (
        <header className="app-header">
          <h2 className="app-header-title">NexusAssess</h2>
          <HeaderUserMenu />
        </header>
      )}

      {/* GLOBAL AI CHATBOT, visible on all pages */}
      <ChatbotWidget />

      {/* Global Navigation Aids */}
      <NavigationAids />

      <AppRoutes />

      {!hideFooter && <Footer />}
    </div>
  );
}

function NavigationAids() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isInternalPage = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/dashboard';

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="nav-aid-btn scrollTop"
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '25px',
              zIndex: 9999,
              width: '50px',
              height: '50px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: '0 12px 30px rgba(139, 92, 246, 0.6)',
              translateY: -5
            }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronsUp size={28} color="white" strokeWidth={3} /> Up
          </motion.button>
        )}
      </AnimatePresence>

      {/* Back Button (Only on internal pages) */}
      {isInternalPage && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="nav-aid-btn backBtn"
          style={{
            position: 'fixed',
            bottom: '25px',
            left: '25px',
            zIndex: 9999,
            padding: '10px 18px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
          }}
          whileHover={{ scale: 1.05, border: '1px solid var(--primary)' }}
        >
          <ChevronLeft size={18} /> Back
        </motion.button>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <MainLayout />
  </BrowserRouter>
);
