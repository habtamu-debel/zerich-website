import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import api from '../../lib/api.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Our Work</span>
          <h2 className="section-title">Projects We're Proud Of</h2>
          <p className="section-sub">
            A selection of websites and digital systems we've built for real businesses.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="section-sub" style={{ textAlign: 'center' }}>No projects to show yet.</p>
        ) : (
          <div className="portfolio-grid">
            {projects.map((p) => {
              const Tag = p.link ? 'a' : 'div';
              const linkProps = p.link
                ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' }
                : {};
              return (
                <Tag className="project-card" key={p.id} {...linkProps}>
                  <div className="project-thumb">
                    {p.image
                      ? <img src={p.image} alt={p.title} loading="lazy" />
                      : <span>{p.title.charAt(0)}</span>}
                  </div>
                  <div className="project-info">
                    <div>
                      <h3>{p.title}</h3>
                      <small>{p.category}</small>
                    </div>
                    {p.link && <ArrowUpRight size={18} />}
                  </div>
                </Tag>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/portfolio" className="link-arrow">
            View All Projects <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
