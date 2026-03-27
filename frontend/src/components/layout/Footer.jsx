import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Github,
    Twitter,
    Mail,
    MapPin,
    Cpu,
    ArrowUp,
    Heart,
    Linkedin,
    Rocket,
    Check,
    Loader2,
    AlertCircle
} from 'lucide-react';
import '../../styles/Footer.css';
import { subscribeNewsletter } from '../../utils/api';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            await subscribeNewsletter(email);
            setStatus('success');
            setMessage('Subscribed successfully!');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong.');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <footer className="footer-section">
            <div className="footer-glass-pane">
                <div className="footer-content">
                    {/* Brand Column */}
                    <div className="footer-column brand-col">
                        <div className="footer-logo">
                            <Cpu className="logo-icon" size={32} />
                            <span className="logo-text">NexusAssess</span>
                        </div>
                        <p className="footer-tagline">
                            Master your technical interviews with Gen-Z powered AI insights.
                            Real-time feedback, mock interviews, and behavioral prep tailored for you.
                        </p>
                        <div className="social-links">
                            <a href="https://github.com/prabhattripathi-11" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                                <Github size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/prabhat-tripathi-38b161293/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://x.com/Prabhat74976639" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="footer-column links-col">
                        <h3 className="footer-heading">Platform</h3>
                        <ul className="footer-links">
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/quiz">AI Quiz</Link></li>
                            <li><Link to="/interview">Mock Interview</Link></li>
                            <li><Link to="/resume">Resume Review</Link></li>
                            <li><Link to="/analytics">Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Support/Company */}
                    <div className="footer-column links-col">
                        <h3 className="footer-heading">Support</h3>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/feedback">Feedback</Link></li>
                            <li><a href="mailto:support@prepfolio.ai">Contact Support</a></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="footer-column cta-col">
                        <h3 className="footer-heading">Stay Connected</h3>
                        <p className="cta-text">
                            Join our newsletter for the latest AI interview tips and feature updates.
                        </p>
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <div className={`input-group ${status === 'error' ? 'input-error' : ''}`}>
                                <Mail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading' || status === 'success'}
                                />
                                <button
                                    type="submit"
                                    className={`newsletter-btn ${status}`}
                                    aria-label="Subscribe"
                                    disabled={status === 'loading' || status === 'success'}
                                >
                                    {status === 'loading' ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : status === 'success' ? (
                                        <Check size={18} />
                                    ) : (
                                        <Rocket size={18} />
                                    )}
                                </button>
                            </div>
                            {message && (
                                <p className={`newsletter-msg ${status}`}>
                                    {status === 'error' && <AlertCircle size={14} />}
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} NexusAssess. Built with <Heart size={14} className="heart-icon" fill="currentColor" /> by Prabhat
                    </p>
                    <button onClick={scrollToTop} className="footer-scroll-top" aria-label="Scroll to top">
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
