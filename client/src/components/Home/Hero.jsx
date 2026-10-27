import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, GraduationCap, Boxes } from 'lucide-react';
import api from '../../lib/api.js';

const fallbackStats = {
  stats_projects: '100+',
  stats_clients: '50+',
  stats_years: '5+',
  stats_satisfaction: '98%',
};

const float = (delay = 0) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay },
});

export default function Hero() {
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    api.get('/settings')
      .then((res) => setStats({ ...fallbackStats, ...res.data }))
      .catch(() => {});
  }, []);

  const items = [
    { value: stats.stats_projects, label: 'Projects Completed' },
    { value: stats.stats_clients, label: 'Happy Clients' },
    { value: stats.stats_years, label: 'Years Experience' },
    { value: stats.stats_satisfaction, label: 'Client Satisfaction' },
  ];

  return (
    <section className="hero">
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Ideas · Design · Develop · Grow</span>
          <h1>
            Digital Solutions for a <span className="gradient-text">Brighter Tomorrow</span>
          </h1>
          <p>
            We build branding websites, e-commerce stores, EdTech platforms and ERP systems that
            help businesses grow, with creative design, modern technology and strategic thinking.
          </p>

          <div className="hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/portfolio" className="btn btn-outline">
              View Our Work
            </Link>
          </div>

          <div className="hero-stats">
            {items.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="mock-window">
            <div className="mock-bar"><span /><span /><span /></div>
            <div className="mock-body">
              <div className="mock-side">
                <i /><i /><i /><i />
              </div>
              <div className="mock-main">
                <div className="mock-headline">We Build Digital Products That Matter</div>
                <div className="mock-cards">
                  <div /><div /><div />
                </div>
                <div className="mock-chart">
                  {[40, 65, 50, 80, 62, 95, 75].map((h, i) => (
                    <b key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div className="chip chip-1" {...float(0)}>
            <ShoppingCart size={18} /> E-Commerce
          </motion.div>
          <motion.div className="chip chip-2" {...float(1.2)}>
            <GraduationCap size={18} /> EdTech
          </motion.div>
          <motion.div className="chip chip-3" {...float(2.2)}>
            <Boxes size={18} /> ERP Systems
          </motion.div>
        </div>
      </div>
    </section>
  );
}