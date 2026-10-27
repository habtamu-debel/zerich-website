import { useEffect, useState } from 'react';
import { Target, Eye, Lightbulb, ShieldCheck, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import CTA from '../components/Home/CTA.jsx';
import api from '../lib/api.js';

// Draft copy: rewrite with ZeRich's real story, mission and vision
const cards = [
  { icon: Target, title: 'Our Mission', text: 'To help businesses grow by turning their ideas into reliable, well-designed digital products.' },
  { icon: Eye, title: 'Our Vision', text: 'To be a trusted technology partner for businesses and institutions across Ethiopia and beyond.' },
];

const values = [
  { icon: Lightbulb, title: 'Innovation', text: 'We use modern tools and fresh thinking to solve real problems.' },
  { icon: ShieldCheck, title: 'Reliability', text: 'We deliver on time, communicate clearly and support what we build.' },
  { icon: Users, title: 'Partnership', text: 'We work with you as a team, not just as a vendor.' },
];

export default function About() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/settings').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const items = [
    [stats.stats_projects, 'Projects Completed'],
    [stats.stats_clients, 'Happy Clients'],
    [stats.stats_years, 'Years Experience'],
    [stats.stats_satisfaction, 'Client Satisfaction'],
  ];

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="We Are ZeRich Technologies"
        text="We build branding websites, e-commerce stores, EdTech platforms and ERP systems that help businesses work smarter and grow faster."
      />

      <section className="section">
        <div className="container about-cards">
          {cards.map((c) => (
            <div className="about-card" key={c.title}>
              <span className="service-icon tone-0"><c.icon size={26} /></span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <span className="eyebrow">Our Values</span>
          <h2 className="section-title">What Guides Our Work</h2>
          <div className="values-grid">
            {values.map((v) => (
              <div className="about-card" key={v.title}>
                <span className="service-icon tone-2"><v.icon size={24} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-stats">
          {items.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}