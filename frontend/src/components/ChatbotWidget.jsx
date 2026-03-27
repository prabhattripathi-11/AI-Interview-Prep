// ChatbotWidget.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Sparkles, ArrowUp } from "lucide-react";
import "../styles/ChatbotWidget.css";
import { getChatResponse } from "../utils/api";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = { from: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.from === "user" ? "user" : "model",
        content: m.text,
      }));

      const token = localStorage.getItem('token');
      const data = await getChatResponse(token, currentMessage, history);

      const botMsg = { from: "bot", text: data.reply || "No reply." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Technical glitch. AI logic offline. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chatbot-window"
          >
            <div className="chatbot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="bot-status-icon">
                  <Bot size={18} />
                  <div className="status-dot"></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>AI Career Coach</div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Quantum-Ready</div>
                </div>
              </div>
              <button
                className="chatbot-close"
                onClick={() => setOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', opacity: 0.6, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="chatbot-body" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="chat-empty-state">
                  <Sparkles size={32} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.8 }} />
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Yo! I'm your AI Coach.</p>
                  <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Ask me anything about your prep.</p>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.from === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`chatbot-msg ${m.from === "user" ? "chatbot-msg-user" : "chatbot-msg-bot"}`}
                >
                  <div style={{ fontSize: '0.9rem' }}>{m.text}</div>
                </motion.div>
              ))}

              {loading && (
                <div className="chatbot-typing">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
            </div>

            <form className="chatbot-input-row" onSubmit={handleSend}>
              <input
                className="chatbot-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your flex..."
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="chatbot-send-btn"
                type="submit"
                disabled={loading || !message.trim()}
              >
                <span>SEND</span>
                <ArrowUp size={16} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.9 }}
        className={`chatbot-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
