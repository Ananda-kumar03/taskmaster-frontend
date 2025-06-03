// EnhancedLandingPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import {
  FaRocket, FaCheckCircle, FaMoon, FaRedo, FaChartLine
} from 'react-icons/fa';
import './LandingPage.css';

const features = [
  { icon: <FaCheckCircle />, text: 'Smart Task Management' },
  { icon: <FaRedo />, text: 'Recurring Tasks & Reminders' },
  { icon: <FaMoon />, text: 'Dark Mode Toggle' },
  { icon: <FaChartLine />, text: 'Daily Reflection & Insights' },
];

const EnhancedLandingPage = () => {
  useEffect(() => {
    document.body.classList.remove('dark');
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="enhanced-landing">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: '#f9fafb' },
          particles: {
            number: { value: 50 },
            size: { value: 2 },
            move: { enable: true, speed: 1 },
            links: { enable: true, distance: 150, color: '#61dafb', opacity: 0.5 },
          },
        }}
        style={{ position: 'absolute', zIndex: 0, width: '100%', height: '100%' }}
      />

      <motion.header
        className="hero-section"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h1 className="hero-title">🧠 TaskMaster</h1>
        <p className="hero-subtitle">Organize smarter. Achieve faster. Reflect deeper.</p>
        <div className="hero-buttons">
          <Link to="/login" className="btn primary">Login</Link>
          <Link to="/register" className="btn secondary">Register</Link>
        </div>
      </motion.header>

      <section className="features-section">
        <h2><FaRocket className="rocket-icon" /> Features</h2>
        <motion.div className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              className="feature-card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <p className="feature-text">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="how-it-works">
        <h2>⚙️ How It Works</h2>
        <motion.div className="how-steps" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          {[1, 2, 3].map((step, i) => (
            <motion.div key={i} className="step-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <h3>Step {step}</h3>
              <p>{["Create your first task and set a due date with reminders.", "Organize tasks with tags, priorities, and subtasks.", "Review your day with smart reflections and recurring insights."][i]}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="why-section">
        <h2>💡 Why TaskMaster?</h2>
        <ul className="why-list">
          <li>🧩 Minimal & distraction-free UI</li>
          <li>🔒 Secure login & data storage</li>
          <li>🧠 Personalized stats & reflection</li>
          <li>🎨 Fully customizable profile</li>
        </ul>
      </section>

      <footer className="enhanced-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
          <div className="footer-links">
            <a href="mailto:support@taskmaster.com">Contact</a>
            <a href="https://github.com/your-repo" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedLandingPage;
